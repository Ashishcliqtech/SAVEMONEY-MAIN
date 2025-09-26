import express from 'express';
import { supabase } from '../config/database';
import { redisHelpers } from '../config/redis';
import { authenticateToken, AuthRequest, requireAdmin, optionalAuth } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Get all categories (public)
router.get('/', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const cacheKey = 'categories:all';
  const cachedData = await redisHelpers.getCached(cacheKey);
  
  if (cachedData) {
    return res.json({
      success: true,
      categories: cachedData,
      cached: true,
    });
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw createError('Failed to fetch categories', 500);
  }

  // Cache for 60 minutes
  await redisHelpers.cache(cacheKey, categories, 60);

  res.json({
    success: true,
    categories,
  });
}));

// Get single category with stores and offers (public)
router.get('/:id', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const [categoryResult, storesResult, offersResult] = await Promise.all([
    supabase.from('categories').select('*').eq('id', id).single(),
    supabase.from('stores').select('*').eq('category_id', id).eq('is_active', true),
    supabase.from('offers').select(`
      *,
      store:stores(*)
    `).eq('category_id', id).eq('is_active', true)
  ]);

  if (categoryResult.error || !categoryResult.data) {
    throw createError('Category not found', 404);
  }

  if (storesResult.error) {
    throw createError('Failed to fetch category stores', 500);
  }

  if (offersResult.error) {
    throw createError('Failed to fetch category offers', 500);
  }

  res.json({
    success: true,
    category: categoryResult.data,
    stores: storesResult.data,
    offers: offersResult.data,
  });
}));

// Admin: Create category
router.post('/', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const categoryData = {
    ...req.body,
    is_active: true,
    store_count: 0,
    offer_count: 0,
    sort_order: req.body.sort_order || 0,
  };

  const { data: category, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select()
    .single();

  if (error) {
    throw createError('Failed to create category', 500);
  }

  // Clear cache
  await redisHelpers.deleteCached('categories:all');

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category,
  });
}));

// Admin: Update category
router.patch('/:id', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  const { data: category, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw createError('Failed to update category', 500);
  }

  // Clear cache
  await redisHelpers.deleteCached('categories:all');

  res.json({
    success: true,
    message: 'Category updated successfully',
    category,
  });
}));

// Admin: Delete category
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Failed to delete category', 500);
  }

  // Clear cache
  await redisHelpers.deleteCached('categories:all');

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
}));

export default router;