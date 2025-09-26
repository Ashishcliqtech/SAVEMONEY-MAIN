// Authentication utilities for production

export const AuthErrors = {
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials.',
  EMAIL_NOT_CONFIRMED: 'Please verify your email address before signing in.',
  TOO_MANY_REQUESTS: 'Too many attempts. Please try again later.',
  USER_NOT_FOUND: 'No account found with this email address.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  SIGNUP_DISABLED: 'New signups are currently disabled. Please contact support.',
  OAUTH_NOT_ENABLED: 'Social login is not configured. Please contact support.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  INVALID_OTP: 'Invalid OTP. Please check and try again.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;

export const mapSupabaseError = (error: any): string => {
  if (!error?.message) return AuthErrors.UNKNOWN_ERROR;
  
  const message = error.message.toLowerCase();
  
  if (message.includes('invalid login credentials')) {
    return AuthErrors.INVALID_CREDENTIALS;
  }
  if (message.includes('email not confirmed')) {
    return AuthErrors.EMAIL_NOT_CONFIRMED;
  }
  if (message.includes('too many requests')) {
    return AuthErrors.TOO_MANY_REQUESTS;
  }
  if (message.includes('user already registered')) {
    return AuthErrors.EMAIL_ALREADY_EXISTS;
  }
  if (message.includes('password should be at least')) {
    return AuthErrors.WEAK_PASSWORD;
  }
  if (message.includes('unable to validate email')) {
    return AuthErrors.INVALID_EMAIL;
  }
  if (message.includes('signup_disabled')) {
    return AuthErrors.SIGNUP_DISABLED;
  }
  if (message.includes('oauth provider not enabled')) {
    return AuthErrors.OAUTH_NOT_ENABLED;
  }
  if (message.includes('token has expired')) {
    return AuthErrors.OTP_EXPIRED;
  }
  if (message.includes('invalid token')) {
    return AuthErrors.INVALID_OTP;
  }
  if (message.includes('rate limit exceeded')) {
    return AuthErrors.RATE_LIMIT_EXCEEDED;
  }
  if (message.includes('network') || message.includes('fetch')) {
    return AuthErrors.NETWORK_ERROR;
  }
  
  return error.message || AuthErrors.UNKNOWN_ERROR;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const generateSecureReferralCode = (name: string): string => {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${randomSuffix}`;
};

export const sanitizeUserInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const formatUserData = (userData: any): User => {
  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    avatar: userData.avatar_url,
    phone: userData.phone,
    referralCode: userData.referral_code,
    totalCashback: userData.total_cashback || 0,
    availableCashback: userData.available_cashback || 0,
    pendingCashback: userData.pending_cashback || 0,
    role: userData.role || 'user',
    createdAt: userData.created_at,
  };
};

// Rate limiting for client-side protection
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeLeft);
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const otpRateLimiter = new RateLimiter(3, 5 * 60 * 1000); // 3 attempts per 5 minutes