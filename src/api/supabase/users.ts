import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import { Tables, Inserts, Updates } from '../../lib/supabase';

export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin' | 'moderator';
  isActive?: boolean;
  isVerified?: boolean;
  sortBy?: 'name' | 'email' | 'created_at' | 'total_cashback';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const userService = {
  // Get all users (admin only)
  async getUsers(filters: UserFilters = {}) {
    let query = supabase
      .from('users')
      .select('*');

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters.isVerified !== undefined) {
      query = query.eq('is_verified', filters.isVerified);
    }

    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      users: data as User[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  // Get single user
  async getUser(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as User;
  },

  // Update user profile
  async updateUser(id: string, updates: Updates<'users'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Update user status (admin only)
  async updateUserStatus(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  },

  // Update user role (admin only)
  async updateUserRole(id: string, role: 'user' | 'admin' | 'moderator'): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id);

    if (error) throw error;
  },

  // Get user dashboard data
  async getUserDashboard(userId: string) {
    const [userResult, transactionsResult, referralsResult] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('transactions').select(`
        *,
        store:stores(*)
      `).eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('referrals').select('*').eq('referrer_id', userId)
    ]);

    if (userResult.error) throw userResult.error;
    if (transactionsResult.error) throw transactionsResult.error;
    if (referralsResult.error) throw referralsResult.error;

    return {
      user: userResult.data as User,
      recentTransactions: transactionsResult.data,
      referralStats: {
        totalReferrals: referralsResult.data.length,
        totalEarnings: referralsResult.data.reduce((sum, ref) => sum + ref.bonus_amount, 0),
      },
    };
  },

  // Get user statistics (admin only)
  async getUserStats() {
    const { data, error } = await supabase.rpc('get_user_statistics');
    if (error) throw error;
    return data;
  },
};