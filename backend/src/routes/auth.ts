import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/database';
import { redisHelpers } from '../config/redis';
import { emailService } from '../config/email';
import { generateTokens, generatePasswordResetToken, verifyPasswordResetToken } from '../utils/jwt';
import { generateOTP, generateReferralCode, sanitizeInput } from '../utils/validation';
import { validate, authSchemas } from '../middleware/validation';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Send OTP for signup
router.post('/send-otp', validate(authSchemas.sendOTP), asyncHandler(async (req, res) => {
  const { email, name, signupData } = req.body;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existingUser) {
    throw createError('User with this email already exists', 409);
  }

  // Generate OTP
  const otp = generateOTP(6);
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');

  // Store OTP in Redis
  await redisHelpers.storeOTP(email, otp, expiryMinutes);

  // Store signup data in Redis (if provided)
  if (signupData) {
    await redisHelpers.storeSignupData(email, signupData, 30);
  }

  // Send OTP email
  await emailService.sendOTP(email, name, otp);

  res.json({
    success: true,
    message: 'OTP sent successfully',
    expiresIn: expiryMinutes * 60, // seconds
  });
}));

// Verify OTP and complete signup
router.post('/verify-otp', validate(authSchemas.verifyOTP), asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Verify OTP
  const isValidOTP = await redisHelpers.verifyOTP(email, otp);
  if (!isValidOTP) {
    throw createError('Invalid or expired OTP', 400);
  }

  // Get signup data from Redis
  const signupData = await redisHelpers.getSignupData(email);
  if (!signupData) {
    throw createError('Signup session expired. Please start again.', 400);
  }

  // Generate referral code
  const referralCode = generateReferralCode(signupData.name);

  // Find referrer if referral code provided
  let referrerId = null;
  if (signupData.referralCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', signupData.referralCode.toUpperCase())
      .single();
    
    referrerId = referrer?.id || null;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(signupData.password, 12);

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email.toLowerCase(),
    password: signupData.password,
    email_confirm: true,
    user_metadata: {
      name: signupData.name,
      phone: signupData.phone,
    },
  });

  if (authError) {
    throw createError(authError.message, 400);
  }

  // Create user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: email.toLowerCase(),
      name: sanitizeInput(signupData.name),
      phone: signupData.phone || null,
      referral_code: referralCode,
      referred_by: referrerId,
      is_verified: true,
      is_active: true,
    })
    .select()
    .single();

  if (userError) {
    // Cleanup auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw createError('Failed to create user profile', 500);
  }

  // Clean up Redis data
  await redisHelpers.deleteSignupData(email);

  // Generate JWT tokens
  const tokens = generateTokens({
    userId: userData.id,
    email: userData.email,
    role: userData.role,
  });

  // Send welcome email
  emailService.sendWelcomeEmail(email, signupData.name).catch(console.error);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: userData,
    ...tokens,
  });
}));

// Login
router.post('/login', validate(authSchemas.login), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user from database
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !user) {
    throw createError('Invalid email or password', 401);
  }

  if (!user.is_active) {
    throw createError('Account is deactivated. Please contact support.', 401);
  }

  // Verify password with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password,
  });

  if (authError) {
    throw createError('Invalid email or password', 401);
  }

  // Update last login
  await supabase
    .from('users')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', user.id);

  // Generate JWT tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    success: true,
    message: 'Login successful',
    user,
    ...tokens,
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError('Refresh token required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user || !user.is_active) {
      throw createError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      user,
      ...tokens,
    });
  } catch (error) {
    throw createError('Invalid refresh token', 401);
  }
}));

// Forgot password
router.post('/forgot-password', validate(authSchemas.forgotPassword), asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('email', email.toLowerCase())
    .single();

  // Always return success for security (don't reveal if email exists)
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link.',
    });
  }

  // Generate reset token
  const resetToken = generatePasswordResetToken(user.id);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Send password reset email
  await emailService.sendPasswordResetEmail(user.email, user.name, resetLink);

  res.json({
    success: true,
    message: 'If an account with this email exists, you will receive a password reset link.',
  });
}));

// Reset password
router.post('/reset-password', validate(authSchemas.resetPassword), asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Verify reset token
  const { userId } = verifyPasswordResetToken(token);

  // Get user
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw createError('Invalid or expired reset token', 400);
  }

  // Update password in Supabase Auth
  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    password,
  });

  if (updateError) {
    throw createError('Failed to update password', 500);
  }

  res.json({
    success: true,
    message: 'Password reset successfully',
  });
}));

// Logout
router.post('/logout', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can blacklist the token or clear server-side sessions if needed
  
  if (req.user) {
    await redisHelpers.deleteSession(req.user.id);
  }

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}));

// Get current user
router.get('/me', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
}));

export default router;