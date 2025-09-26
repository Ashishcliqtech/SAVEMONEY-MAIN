import { supabase } from '../../lib/supabase';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: '7d' | '30d' | '90d' | '1y';
}

export const analyticsService = {
  // Get admin dashboard statistics
  async getAdminStats() {
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
    if (error) throw error;
    return data;
  },

  // Get user analytics
  async getUserAnalytics(filters: AnalyticsFilters = {}) {
    const { data, error } = await supabase.rpc('get_user_analytics', {
      start_date: filters.startDate,
      end_date: filters.endDate,
      period: filters.period || '30d',
    });
    if (error) throw error;
    return data;
  },

  // Get revenue analytics
  async getRevenueAnalytics(filters: AnalyticsFilters = {}) {
    const { data, error } = await supabase.rpc('get_revenue_analytics', {
      start_date: filters.startDate,
      end_date: filters.endDate,
      period: filters.period || '30d',
    });
    if (error) throw error;
    return data;
  },

  // Get store performance
  async getStorePerformance(filters: AnalyticsFilters = {}) {
    const { data, error } = await supabase.rpc('get_store_performance', {
      start_date: filters.startDate,
      end_date: filters.endDate,
    });
    if (error) throw error;
    return data;
  },

  // Get offer performance
  async getOfferPerformance(filters: AnalyticsFilters = {}) {
    const { data, error } = await supabase.rpc('get_offer_performance', {
      start_date: filters.startDate,
      end_date: filters.endDate,
    });
    if (error) throw error;
    return data;
  },

  // Get category breakdown
  async getCategoryBreakdown() {
    const { data, error } = await supabase.rpc('get_category_breakdown');
    if (error) throw error;
    return data;
  },

  // Generate custom report
  async generateReport(
    reportType: 'financial' | 'user' | 'store' | 'offer' | 'transaction',
    filters: AnalyticsFilters & { format?: 'json' | 'csv' }
  ) {
    const { data, error } = await supabase.rpc('generate_custom_report', {
      report_type: reportType,
      start_date: filters.startDate,
      end_date: filters.endDate,
      format: filters.format || 'json',
    });
    if (error) throw error;
    return data;
  },
};