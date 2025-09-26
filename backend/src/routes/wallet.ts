import express from 'express';
import { supabase } from '../config/database';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import { validate, walletSchemas } from '../middleware/validation';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Get wallet data
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;

  const { data: user, error } = await supabase
    .from('users')
    .select('total_cashback, available_cashback, pending_cashback')
    .eq('id', userId)
    .single();

  if (error) {
    throw createError('Failed to fetch wallet data', 500);
  }

  const walletData = {
    totalCashback: user.total_cashback || 0,
    availableCashback: user.available_cashback || 0,
    pendingCashback: user.pending_cashback || 0,
    withdrawnCashback: (user.total_cashback || 0) - (user.available_cashback || 0) - (user.pending_cashback || 0),
  };

  res.json({
    success: true,
    wallet: walletData,
  });
}));

// Get transactions
router.get('/transactions', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: transactions, error, count } = await supabase
    .from('transactions')
    .select(`
      *,
      store:stores(*),
      offer:offers(*)
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw createError('Failed to fetch transactions', 500);
  }

  res.json({
    success: true,
    transactions,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}));

// Create withdrawal request
router.post('/withdraw', authenticateToken, validate(walletSchemas.withdraw), asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const { amount, method, accountDetails } = req.body;

  // Check if user has sufficient balance
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('available_cashback')
    .eq('id', userId)
    .single();

  if (userError) {
    throw createError('Failed to fetch user data', 500);
  }

  if ((user.available_cashback || 0) < amount) {
    throw createError('Insufficient balance', 400);
  }

  // Check minimum withdrawal amount
  const minAmounts = {
    upi: 10,
    bank: 50,
    paytm: 10,
    voucher: 100,
  };

  if (amount < minAmounts[method as keyof typeof minAmounts]) {
    throw createError(`Minimum withdrawal amount for ${method} is ₹${minAmounts[method as keyof typeof minAmounts]}`, 400);
  }

  // Create withdrawal request
  const { data: withdrawal, error: withdrawalError } = await supabase
    .from('withdrawals')
    .insert({
      user_id: userId,
      amount,
      method,
      account_details: accountDetails,
      status: 'pending',
    })
    .select()
    .single();

  if (withdrawalError) {
    throw createError('Failed to create withdrawal request', 500);
  }

  // Update user's available cashback
  const { error: updateError } = await supabase
    .from('users')
    .update({
      available_cashback: (user.available_cashback || 0) - amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    // Rollback withdrawal request
    await supabase.from('withdrawals').delete().eq('id', withdrawal.id);
    throw createError('Failed to process withdrawal', 500);
  }

  res.status(201).json({
    success: true,
    message: 'Withdrawal request submitted successfully',
    withdrawal,
  });
}));

// Get withdrawal history
router.get('/withdrawals', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;

  const { data: withdrawals, error } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw createError('Failed to fetch withdrawal history', 500);
  }

  res.json({
    success: true,
    withdrawals,
  });
}));

// Admin: Get all withdrawals
router.get('/admin/withdrawals', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    method,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = req.query;

  let query = supabase
    .from('withdrawals')
    .select(`
      *,
      user:users(name, email)
    `, { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  if (method) {
    query = query.eq('method', method);
  }

  // Sorting
  query = query.order(sortBy as string, { ascending: sortOrder === 'asc' });

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const from = (pageNum - 1) * limitNum;
  const to = from + limitNum - 1;

  query = query.range(from, to);

  const { data: withdrawals, error, count } = await query;

  if (error) {
    throw createError('Failed to fetch withdrawals', 500);
  }

  res.json({
    success: true,
    withdrawals,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limitNum),
    },
  });
}));

// Admin: Update withdrawal status
router.patch('/admin/withdrawals/:id', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, adminNotes, transactionId } = req.body;

  if (!['pending', 'processing', 'completed', 'failed'].includes(status)) {
    throw createError('Invalid status', 400);
  }

  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes) updates.admin_notes = adminNotes;
  if (transactionId) updates.transaction_id = transactionId;
  if (status === 'completed') updates.processed_at = new Date().toISOString();

  const { data: withdrawal, error } = await supabase
    .from('withdrawals')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      user:users(name, email)
    `)
    .single();

  if (error) {
    throw createError('Failed to update withdrawal status', 500);
  }

  res.json({
    success: true,
    message: 'Withdrawal status updated successfully',
    withdrawal,
  });
}));

export default router;