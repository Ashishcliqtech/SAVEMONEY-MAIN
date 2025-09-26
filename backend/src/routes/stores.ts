import express from 'express';
import { dbHelpers } from '../config/database';
import { redisHelpers } from '../config/redis';
import { authenticateToken, AuthRequest, requireAdmin, optionalAuth } from '../middleware/auth';
import { validate, storeSchemas } from '../middleware/validation';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Get all stores (public)
router.get('/', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const filters = {
    category: req.query.category,
    search: req.query.search,
    isPopular: req.query.isPopular === 'true' ? true : undefined,
    isActive: req.query.isActive !== 'false', // Default to active only
    sortBy: req.query.sortBy || 'created_at',
    sortOrder: req.query.sortOrder || 'desc',
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 12,
  };

  // Try to get from cache first
  const cacheKey = `stores:${JSON.stringify(filters)}`;
  const cachedData = await redisHelpers.getCached(cacheKey);
  
  if (cachedData) {
    return res.json({
      success: true,
      ...cachedData,
      cached: true,
    });
  }

  const result = await dbHelpers.getStores(filters);

  // Cache for 10 minutes
  await redisHelpers.cache(cacheKey, result, 10);

  res.json({
    success: true,
    ...result,
  });
}));

// Get single store (public)
router.get('/:id', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { data: store, error } = await supabase
    .from('stores')
    .select(`
      *,
      category:categories(*),
      offers:offers(*)
    `)
    .eq('id', id)
    .single();

  if (error || !store) {
    throw createError('Store not found', 404);
  }

  res.json({
    success: true,
    store,
  });
}));

// Get popular stores (public)
router.get('/featured/popular', asyncHandler(async (req, res) => {
  const cacheKey = 'stores:popular';
  const cachedData = await redisHelpers.getCached(cacheKey);
  
  if (cachedData) {
    return res.json({
      success: true,
      stores: cachedData,
      cached: true,
    });
  }

  const { data: stores, error } = await supabase
    .from('stores')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_popular', true)
    .eq('is_active', true)
    .order('total_clicks', { ascending: false })
    .limit(12);

  if (error) {
    throw createError('Failed to fetch popular stores', 500);
  }

  // Cache for 30 minutes
  await redisHelpers.cache(cacheKey, stores, 30);

  res.json({
    success: true,
    stores,
  });
}));

// Track store click
router.post('/:id/track', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  // Increment click count
  const { error } = await supabase.rpc('increment_store_clicks', {
    store_id: id
  });

  if (error) {
    console.error('Failed to track store click:', error);
  }

  res.json({
    success: true,
    message: 'Click tracked',
  });
}));

// Admin: Create store
router.post('/', authenticateToken, requireAdmin, validate(storeSchemas.create), asyncHandler(async (req: AuthRequest, res) => {
  const storeData = {
    ...req.body,
    is_active: true,
    total_offers: 0,
    total_clicks: 0,
    total_conversions: 0,
  };

  const { data: store, error } = await supabase
    .from('stores')
    .insert(storeData)
    .select(`
      *,
      category:categories(*)
    `)
    .single();

  if (error) {
    throw createError('Failed to create store', 500);
  }

  // Clear cache
  await redisHelpers.deleteCached('stores:popular');

  res.status(201).json({
    success: true,
    message: 'Store created successfully',
    store,
  });
}));

// Admin: Update store
router.patch('/:id', authenticateToken, requireAdmin, validate(storeSchemas.update), asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  const { data: store, error } = await supabase
    .from('stores')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      category:categories(*)
    `)
    .single();

  if (error) {
    throw createError('Failed to update store', 500);
  }

  // Clear cache
  await redisHelpers.deleteCached('stores:popular');

  res.json({
    success: true,
    message: 'Store updated successfully',
    store,
  });
}));

// Admin: Delete store
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Failed to delete store', 500);
  }

  // Clear cache
  await redisHelpers.deleteCached('stores:popular');

  res.json({
    success: true,
    message: 'Store deleted successfully',
  });
}));

export default router;