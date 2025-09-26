export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  referral_code: string;
  total_cashback: number;
  available_cashback: number;
  pending_cashback: number;
  is_verified: boolean;
  is_active: boolean;
  role: 'user' | 'admin' | 'moderator';
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  website_url?: string;
  cashback_rate: number;
  category_id?: string;
  is_popular: boolean;
  is_featured: boolean;
  is_active: boolean;
  total_offers: number;
  total_clicks: number;
  total_conversions: number;
  commission_rate: number;
  tracking_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  store_id: string;
  category_id?: string;
  cashback_rate: number;
  original_price?: number;
  discounted_price?: number;
  coupon_code?: string;
  offer_type: 'cashback' | 'coupon' | 'deal';
  image_url?: string;
  terms?: string[];
  min_order_value: number;
  expiry_date?: string;
  is_exclusive: boolean;
  is_trending: boolean;
  is_featured: boolean;
  is_active: boolean;
  click_count: number;
  conversion_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image_url?: string;
  store_count: number;
  offer_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  store_id: string;
  offer_id?: string;
  order_id: string;
  amount: number;
  cashback_rate: number;
  cashback_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  tracking_id?: string;
  commission_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm' | 'voucher';
  account_details: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  admin_notes?: string;
  transaction_id?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'deal' | 'cashback' | 'withdrawal' | 'referral' | 'support' | 'system';
  action_url?: string;
  image_url?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: 'cashback' | 'withdrawal' | 'account' | 'technical' | 'general';
  assigned_to?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  bonus_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmed_at?: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}