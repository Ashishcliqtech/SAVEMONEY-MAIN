export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  referralCode: string;
  totalCashback: number;
  availableCashback: number;
  pendingCashback: number;
  role?: 'user' | 'admin' | 'moderator';
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  banner?: string;
  description: string;
  cashbackRate: number;
  category: string;
  isPopular: boolean;
  totalOffers: number;
  website: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  store: Store;
  cashbackRate: number;
  originalPrice?: number;
  discountedPrice?: number;
  couponCode?: string;
  offerType: 'cashback' | 'coupon' | 'deal';
  category: string;
  expiryDate: string;
  isExclusive: boolean;
  isTrending: boolean;
  imageUrl: string;
  terms: string[];
  minOrderValue?: number;
}

export interface Transaction {
  id: string;
  store: Store;
  amount: number;
  cashbackEarned: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  date: string;
  orderId: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm' | 'voucher';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: string;
  completedDate?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  storeCount: number;
  offerCount: number;
}

export interface ReferralData {
  totalEarnings: number;
  totalReferrals: number;
  pendingEarnings: number;
  referralCode: string;
  referralLink: string;
  recentReferrals: Array<{
    id: string;
    name: string;
    email: string;
    earnings: number;
    status: string;
    joinedDate: string;
  }>;
}

export interface NotificationData {
  id: string;
  type: 'deal' | 'cashback' | 'withdrawal' | 'referral' | 'support';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalOffers: number;
  totalCashbackPaid: number;
  pendingWithdrawals: number;
  monthlyGrowth: number;
}

export type Language = 'en' | 'hi';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
    900: string;
  };
  secondary: {
    50: string;
    500: string;
    600: string;
  };
  accent: {
    50: string;
    500: string;
    600: string;
  };
  success: {
    50: string;
    500: string;
  };
  warning: {
    50: string;
    500: string;
  };
  error: {
    50: string;
    500: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}