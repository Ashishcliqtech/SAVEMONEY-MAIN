import express from 'express';
import { supabase } from '../config/database';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import { validate, userSchemas } from '../middleware/validation';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
}));

// Update user profile
router.patch('/me', authenticateToken, validate(userSchemas.updateProfile), asyncHandler(async (req: AuthRequest, res) => {
  const { name, phone, avatar_url } = req.body;
  const userId = req.user.id;

  const updates: any = {
    updated_at: new Date().toISOString(),
  };

  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (avatar_url) updates.avatar_url = avatar_url;

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update profile', 500);
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser,
  });
}));

// Get user dashboard data
router.get('/dashboard', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;

  // Get user data with wallet info
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    throw createError('Failed to fetch user data', 500);
  }

  // Get recent transactions
  const { data: transactions, error: transError } = await supabase
    .from('transactions')
    .select(`
      *,
      store:stores(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (transError) {
    console.error('Failed to fetch transactions:', transError);
  }

  // Get referral stats
  const { data: referrals, error: refError } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId);

  if (refError) {
    console.error('Failed to fetch referrals:', refError);
  }

  const dashboardData = {
    user,
    recentTransactions: transactions || [],
    referralStats: {
      totalReferrals: referrals?.length || 0,
      totalEarnings: referrals?.reduce((sum, ref) => sum + (ref.bonus_amount || 0), 0) || 0,
    },
    walletSummary: {
      totalCashback: user.total_cashback || 0,
      availableCashback: user.available_cashback || 0,
      pendingCashback: user.pending_cashback || 0,
    },
  };

  res.json({
    success: true,
    data: dashboardData,
  });
}));

// Admin: Get all users
router.get('/', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isActive,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = req.query;

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  if (isActive !== undefined) {
    query = query.eq('is_active', isActive === 'true');
  }

  // Sorting
  query = query.order(sortBy as string, { ascending: sortOrder === 'asc' });

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const from = (pageNum - 1) * limitNum;
  const to = from + limitNum - 1;

  query = query.range(from, to);

  const { data: users, error, count } = await query;

  if (error) {
    throw createError('Failed to fetch users', 500);
  }

  res.json({
    success: true,
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limitNum),
    },
  });
}));

// Admin: Update user status
router.patch('/:id/status', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update user status', 500);
  }

  res.json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    user: updatedUser,
  });
}));

// Admin: Update user role
router.patch('/:id/role', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin', 'moderator'].includes(role)) {
    throw createError('Invalid role', 400);
  }

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({ 
      role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update user role', 500);
  }

  res.json({
    success: true,
    message: 'User role updated successfully',
    user: updatedUser,
  });
}));

export default router;