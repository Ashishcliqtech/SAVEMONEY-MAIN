import express from 'express';
import { supabase } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Get referral data
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;

  // Get user's referral info
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('referral_code')
    .eq('id', userId)
    .single();

  if (userError) {
    throw createError('Failed to fetch user data', 500);
  }

  // Get referral statistics
  const { data: referrals, error: referralsError } = await supabase
    .from('referrals')
    .select(`
      *,
      referred_user:users!referred_user_id(name, email, created_at)
    `)
    .eq('referrer_id', userId);

  if (referralsError) {
    throw createError('Failed to fetch referral data', 500);
  }

  const totalEarnings = referrals?.reduce((sum, ref) => sum + (ref.bonus_amount || 0), 0) || 0;
  const pendingEarnings = referrals?.filter(ref => ref.status === 'pending').reduce((sum, ref) => sum + (ref.bonus_amount || 0), 0) || 0;

  const referralData = {
    totalEarnings,
    totalReferrals: referrals?.length || 0,
    pendingEarnings,
    referralCode: user.referral_code,
    referralLink: `${process.env.FRONTEND_URL}/ref/${user.referral_code}`,
    recentReferrals: referrals?.slice(0, 10).map(ref => ({
      id: ref.id,
      name: ref.referred_user?.name,
      email: ref.referred_user?.email,
      earnings: ref.bonus_amount,
      status: ref.status,
      joinedDate: ref.referred_user?.created_at,
    })) || [],
  };

  res.json({
    success: true,
    data: referralData,
  });
}));

// Generate new referral link (if needed)
router.post('/generate-link', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;

  const { data: user, error } = await supabase
    .from('users')
    .select('referral_code')
    .eq('id', userId)
    .single();

  if (error) {
    throw createError('Failed to fetch user data', 500);
  }

  const referralLink = `${process.env.FRONTEND_URL}/ref/${user.referral_code}`;

  res.json({
    success: true,
    link: referralLink,
    code: user.referral_code,
  });
}));

// Get referral history
router.get('/history', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: referrals, error, count } = await supabase
    .from('referrals')
    .select(`
      *,
      referred_user:users!referred_user_id(name, email, created_at)
    `, { count: 'exact' })
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw createError('Failed to fetch referral history', 500);
  }

  const formattedReferrals = referrals?.map(ref => ({
    id: ref.id,
    name: ref.referred_user?.name,
    email: ref.referred_user?.email,
    joinedDate: ref.referred_user?.created_at,
    earnings: ref.bonus_amount,
    status: ref.status,
  })) || [];

  res.json({
    success: true,
    referrals: formattedReferrals,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}));

// Process referral (internal function called when user signs up with referral code)
export const processReferral = async (referrerCode: string, newUserId: string) => {
  try {
    // Find referrer
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('referral_code', referrerCode.toUpperCase())
      .single();

    if (referrerError || !referrer) {
      console.log('Referrer not found for code:', referrerCode);
      return;
    }

    // Create referral record
    const bonusAmount = 100; // ₹100 referral bonus
    
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_user_id: newUserId,
        bonus_amount: bonusAmount,
        status: 'pending', // Will be confirmed after first purchase
      })
      .select()
      .single();

    if (referralError) {
      console.error('Failed to create referral record:', referralError);
      return;
    }

    console.log('Referral processed successfully:', referral.id);
  } catch (error) {
    console.error('Error processing referral:', error);
  }
};

// Confirm referral bonus (called when referred user makes first purchase)
export const confirmReferralBonus = async (userId: string) => {
  try {
    // Find pending referral for this user
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_user_id', userId)
      .eq('status', 'pending')
      .single();

    if (referralError || !referral) {
      return; // No pending referral found
    }

    // Update referral status to confirmed
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', referral.id);

    if (updateError) {
      console.error('Failed to confirm referral:', updateError);
      return;
    }

    // Add bonus to referrer's wallet
    const { error: walletError } = await supabase.rpc('add_referral_bonus', {
      user_id: referral.referrer_id,
      bonus_amount: referral.bonus_amount,
    });

    if (walletError) {
      console.error('Failed to add referral bonus:', walletError);
      return;
    }

    console.log('Referral bonus confirmed:', referral.id);
  } catch (error) {
    console.error('Error confirming referral bonus:', error);
  }
};

export default router;