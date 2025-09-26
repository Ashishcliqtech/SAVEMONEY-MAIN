import { supabase } from '../../lib/supabase';
import { Store } from '../../types';
import { Tables, Inserts, Updates } from '../../lib/supabase';

export interface StoreFilters {
  category?: string;
  search?: string;
  isPopular?: boolean;
  isActive?: boolean;
  sortBy?: 'name' | 'cashback_rate' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const storeService = {
  // Get all stores with filters
  async getStores(filters: StoreFilters = {}) {
    try {
      let query = supabase
        .from('stores')
        .select(`
          *,
          category:categories(*)
        `);

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.isPopular !== undefined) {
        query = query.eq('is_popular', filters.isPopular);
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      // Sorting
      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) {
        console.warn('Stores table not found, using fallback:', error.message);
        throw error;
      }

      return {
        stores: data as Store[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.warn('Failed to fetch stores from Supabase:', error);
      throw error;
    }
  },

  // Get single store
  async getStore(id: string): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        category:categories(*),
        offers(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Store;
  },

  // Create store
  async createStore(storeData: Inserts<'stores'>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .insert(storeData)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    return data as Store;
  },

  // Update store
  async updateStore(id: string, updates: Updates<'stores'>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    return data as Store;
  },

  // Delete store
  async deleteStore(id: string): Promise<void> {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get popular stores
  async getPopularStores(): Promise<Store[]> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_popular', true)
        .eq('is_active', true)
        .order('total_clicks', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as Store[];
    } catch (error) {
      console.warn('Failed to fetch popular stores from Supabase:', error);
      throw error;
    }
  },

  // Get featured stores
  async getFeaturedStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(8);

    if (error) throw error;
    return data as Store[];
  },

  // Track store click
  async trackStoreClick(storeId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_store_clicks', {
      store_id: storeId
    });

    if (error) throw error;
  },
};