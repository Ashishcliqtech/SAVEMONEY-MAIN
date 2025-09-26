import express from 'express';
import { dbHelpers } from '../config/database';
import { redisHelpers } from '../config/redis';
import { authenticateToken, AuthRequest, requireAdmin, optionalAuth } from '../middleware/auth';
import { validate, offerSchemas } from '../middleware/validation';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Get all offers (public)
router.get('/', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const filters = {
    storeId: req.query.storeId,
    category: req.query.category,
    offerType: req.query.offerType,
    minCashback: req.query.minCashback ? parseFloat(req.query.minCashback as string) : undefined,
    search: req.query.search,
    isExclusive: req.query.isExclusive === 'true' ? true : undefined,
    isTrending: req.query.isTrending === 'true' ? true : undefined,
    isFeatured: req.query.isFeatured === 'true' ? true : undefined,
    isActive: req.query.isActive !== 'false', // Default to active only
    sortBy: req.query.sortBy || 'created_at',
    sortOrder: req.query.sortOrder || 'desc',
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 12,
  };

  // Try to get from cache first
  const cacheKey = `offers:${JSON.stringify(filters)}`;
  const cachedData = await redisHelpers.getCached(cacheKey);
  
  if (cachedData) {
    return res.json({
      success: true,
      ...cachedData,
      cached: true,
    });
  }

  const result = await dbHelpers.getOffers(filters);

  // Cache for 5 minutes
  await redisHelpers.cache(cacheKey, result, 5);

  res.json({
    success: true,
    ...result,
  });
}));

// Get single offer (public)
router.get('/:id', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { data: offer, error } = await supabase
    .from('offers')
    .select(`
      *,
      store:stores(*),
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (error || !offer) {
    throw createError('Offer not found', 404);
  }

  res.json({
    success: true,
    offer,
  });
}));

// Get trending offers (public)
router.get('/featured/trending', asyncHandler(async (req, res) => {
  const cacheKey = 'offers:trending';
  const cachedData = await redisHelpers.getCached(cacheKey);
  
  if (cachedData) {
    return res.json({
      success: true,
      offers: cachedData,
      cached: true,
    });
  }

  const { data: offers, error } = await supabase
    .from('offers')
    .select(`
      *,
      store:stores(*),
      category:categories(*)
    `)
    .eq('is_trending', true)
    .eq('is_active', true)
    .or('expiry_date.is.null,expiry_date.gt.now()')
    .order('click_count', { ascending: false })
    .limit(8);

  if (error) {
    throw createError('Failed to fetch trending offers', 500);
  }

  // Cache for 15 minutes
  await redisHelpers.cache(cacheKey, offers, 15);

  res.json({
    success: true,
    offers,
  });
}));

// Get featured offers (public)
router.get('/featured/featured', asyncHandler(async (req, res) => {
  const cacheKey = 'offers:featured';
  const cachedData = await redisHelpers.getCached(cacheKey);
  
  if (cachedData) {
    return res.json({
      success: true,
      offers: cachedData,
      cached: true,
    });
  }

  const { data: offers, error } = await supabase
    .from('offers')
    .select(`
      *,
      store:stores(*),
      category:categories(*)
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .or('expiry_date.is.null,expiry_date.gt.now()')
    .order('sort_order', { ascending: true })
    .limit(8);

  if (error) {
    throw createError('Failed to fetch featured offers', 500);
  }

  // Cache for 30 minutes
  await redisHelpers.cache(cacheKey, offers, 30);

  res.json({
    success: true,
    offers,
  });
}));

// Get exclusive offers (public)
router.get('/featured/exclusive', asyncHandler(async (req, res) => {
  const cacheKey = 'offers:exclusive';
  const cachedData = await redisHelpers.getCached(cacheKey);
  
  if (cachedData) {
    return res.json({
      success: true,
      offers: cachedData,
      cached: true,
    });
  }

  const { data: offers, error } = await supabase
    .from('offers')
    .select(`
      *,
      store:stores(*),
      category:categories(*)
    `)
    .eq('is_exclusive', true)
    .eq('is_active', true)
    .or('expiry_date.is.null,expiry_date.gt.now()')
    .order('cashback_rate', { ascending: false })
    .limit(6);

  if (error) {
    throw createError('Failed to fetch exclusive offers', 500);
  }

  // Cache for 20 minutes
  await redisHelpers.cache(cacheKey, offers, 20);

  res.json({
    success: true,
    offers,
  });
}));

// Track offer click
router.post('/:id/track', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  // Increment click count
  const { error } = await supabase.rpc('increment_offer_clicks', {
    offer_id: id
  });

  if (error) {
    console.error('Failed to track offer click:', error);
  }

  res.json({
    success: true,
    message: 'Click tracked',
  });
}));

// Admin: Create offer
router.post('/', authenticateToken, requireAdmin, validate(offerSchemas.create), asyncHandler(async (req: AuthRequest, res) => {
  const offerData = {
    ...req.body,
    is_active: true,
    click_count: 0,
    conversion_count: 0,
    sort_order: 0,
  };

  const { data: offer, error } = await supabase
    .from('offers')
    .insert(offerData)
    .select(`
      *,
      store:stores(*),
      category:categories(*)
    `)
    .single();

  if (error) {
    throw createError('Failed to create offer', 500);
  }

  // Clear relevant caches
  await Promise.all([
    redisHelpers.deleteCached('offers:trending'),
    redisHelpers.deleteCached('offers:featured'),
    redisHelpers.deleteCached('offers:exclusive'),
  ]);

  res.status(201).json({
    success: true,
    message: 'Offer created successfully',
    offer,
  });
}));

// Admin: Update offer
router.patch('/:id', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  const { data: offer, error } = await supabase
    .from('offers')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      store:stores(*),
      category:categories(*)
    `)
    .single();

  if (error) {
    throw createError('Failed to update offer', 500);
  }

  // Clear relevant caches
  await Promise.all([
    redisHelpers.deleteCached('offers:trending'),
    redisHelpers.deleteCached('offers:featured'),
    redisHelpers.deleteCached('offers:exclusive'),
  ]);

  res.json({
    success: true,
    message: 'Offer updated successfully',
    offer,
  });
}));

// Admin: Delete offer
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Failed to delete offer', 500);
  }

  // Clear relevant caches
  await Promise.all([
    redisHelpers.deleteCached('offers:trending'),
    redisHelpers.deleteCached('offers:featured'),
    redisHelpers.deleteCached('offers:exclusive'),
  ]);

  res.json({
    success: true,
    message: 'Offer deleted successfully',
  });
}));

export default router;