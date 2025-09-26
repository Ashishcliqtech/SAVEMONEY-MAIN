import { supabase } from '../../lib/supabase';
import { Offer } from '../../types';
import { Tables, Inserts, Updates } from '../../lib/supabase';

export interface OfferFilters {
  category?: string;
  storeId?: string;
  offerType?: 'cashback' | 'coupon' | 'deal';
  minCashback?: number;
  maxCashback?: number;
  search?: string;
  isExclusive?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  sortBy?: 'cashback_rate' | 'expiry_date' | 'created_at' | 'click_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const offerService = {
  // Get all offers with filters
  async getOffers(filters: OfferFilters = {}) {
    try {
      let query = supabase
        .from('offers')
        .select(`
          *,
          store:stores(*),
          category:categories(*)
        `);

      // Apply filters
      if (filters.store) {
        query = query.eq('store_id', filters.store);
      }

    if (filters.storeId) {
      query = query.eq('store_id', filters.storeId);
    }

    if (filters.offerType) {
      query = query.eq('offer_type', filters.offerType);
    }

    if (filters.minCashback) {
      query = query.gte('cashback_rate', filters.minCashback);
    }

      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

    if (filters.isExclusive !== undefined) {
      query = query.eq('is_exclusive', filters.isExclusive);
    }

    if (filters.isTrending !== undefined) {
      query = query.eq('is_trending', filters.isTrending);
    }

      if (filters.offerType) {
        query = query.eq('offer_type', filters.offerType);
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      // Only show non-expired offers
      query = query.or('expiry_date.is.null,expiry_date.gt.now()');

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
        console.warn('Offers table not found, using fallback:', error.message);
        throw error;
      }

      return {
        offers: data as Offer[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.warn('Failed to fetch offers from Supabase:', error);
      throw error;
    }
  },

  // Get single offer
  async getOffer(id: string): Promise<Offer> {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        store:stores(*),
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Offer;
  },

  // Create offer
  async createOffer(offerData: Inserts<'offers'>): Promise<Offer> {
    const { data, error } = await supabase
      .from('offers')
      .insert(offerData)
      .select(`
        *,
        store:stores(*),
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    return data as Offer;
  },

  // Update offer
  async updateOffer(id: string, updates: Updates<'offers'>): Promise<Offer> {
    const { data, error } = await supabase
      .from('offers')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        store:stores(*),
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    return data as Offer;
  },

  // Delete offer
  async deleteOffer(id: string): Promise<void> {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get trending offers
  async getTrendingOffers(): Promise<Offer[]> {
    const { data, error } = await supabase
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

    if (error) throw error;
    return data as Offer[];
  },

  // Get featured offers
  async getFeaturedOffers(): Promise<Offer[]> {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;
      return data as Offer[];
    } catch (error) {
      console.warn('Failed to fetch featured offers from Supabase:', error);
      throw error;
    }
  },

  // Get exclusive offers
  async getExclusiveOffers(): Promise<Offer[]> {
    const { data, error } = await supabase
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

    if (error) throw error;
    return data as Offer[];
  },

  // Track offer click
  async trackOfferClick(offerId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_offer_clicks', {
      offer_id: offerId
    });

    if (error) throw error;
  },

  // Get offers by store
  async getOffersByStore(storeId: string): Promise<Offer[]> {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        store:stores(*),
        category:categories(*)
      `)
      .eq('store_id', storeId)
      .eq('is_active', true)
      .or('expiry_date.is.null,expiry_date.gt.now()')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as Offer[];
  },
};