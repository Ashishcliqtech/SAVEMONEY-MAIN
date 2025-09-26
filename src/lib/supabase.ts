import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          avatar_url: string | null;
          referral_code: string;
          total_cashback: number;
          available_cashback: number;
          pending_cashback: number;
          is_verified: boolean;
          is_active: boolean;
          role: 'user' | 'admin' | 'moderator';
          referred_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          avatar_url?: string | null;
          referral_code?: string;
          total_cashback?: number;
          available_cashback?: number;
          pending_cashback?: number;
          is_verified?: boolean;
          is_active?: boolean;
          role?: 'user' | 'admin' | 'moderator';
          referred_by?: string | null;
        };
        Update: {
          email?: string;
          name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          total_cashback?: number;
          available_cashback?: number;
          pending_cashback?: number;
          is_verified?: boolean;
          is_active?: boolean;
          role?: 'user' | 'admin' | 'moderator';
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string;
          image_url: string | null;
          store_count: number;
          offer_count: number;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          icon?: string;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          banner_url: string | null;
          website_url: string | null;
          cashback_rate: number;
          category_id: string | null;
          is_popular: boolean;
          is_featured: boolean;
          is_active: boolean;
          total_offers: number;
          total_clicks: number;
          total_conversions: number;
          commission_rate: number;
          tracking_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          website_url?: string | null;
          cashback_rate: number;
          category_id?: string | null;
          is_popular?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          commission_rate?: number;
          tracking_url?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          website_url?: string | null;
          cashback_rate?: number;
          category_id?: string | null;
          is_popular?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          commission_rate?: number;
          tracking_url?: string | null;
          updated_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          store_id: string;
          category_id: string | null;
          cashback_rate: number;
          original_price: number | null;
          discounted_price: number | null;
          coupon_code: string | null;
          offer_type: 'cashback' | 'coupon' | 'deal';
          image_url: string | null;
          terms: string[] | null;
          min_order_value: number;
          expiry_date: string | null;
          is_exclusive: boolean;
          is_trending: boolean;
          is_featured: boolean;
          is_active: boolean;
          click_count: number;
          conversion_count: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          store_id: string;
          category_id?: string | null;
          cashback_rate: number;
          original_price?: number | null;
          discounted_price?: number | null;
          coupon_code?: string | null;
          offer_type: 'cashback' | 'coupon' | 'deal';
          image_url?: string | null;
          terms?: string[] | null;
          min_order_value?: number;
          expiry_date?: string | null;
          is_exclusive?: boolean;
          is_trending?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          store_id?: string;
          category_id?: string | null;
          cashback_rate?: number;
          original_price?: number | null;
          discounted_price?: number | null;
          coupon_code?: string | null;
          offer_type?: 'cashback' | 'coupon' | 'deal';
          image_url?: string | null;
          terms?: string[] | null;
          min_order_value?: number;
          expiry_date?: string | null;
          is_exclusive?: boolean;
          is_trending?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];