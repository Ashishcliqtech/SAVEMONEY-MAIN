export interface User {
  id: string; // From JWT, can remain 'id'
  _id: string; // From database
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
  isVerified?: boolean;
  isActive?: boolean;
}

export interface Store {
  _id: string;
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
  _id: string;
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
  _id: string;
  store: Store;
  amount: number;
  cashbackEarned: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  date: string;
  orderId: string;
}

export interface WithdrawalRequest {
  _id: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm' | 'voucher';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: string;
  completedDate?: string;
}

export interface Category {
  _id: string;
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
    _id: string;
    name: string;
    email: string;
    earnings: number;
    status: string;
    joinedDate: string;
  }>;
}

export interface NotificationData {
  _id: string;
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

export interface ContentSection {
  _id: string;
  name: string;
  type: 'hero' | 'featured' | 'highlighted' | 'banner' | 'testimonial';
  status: 'active' | 'inactive' | 'scheduled';
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  position: number;
  devices: ('desktop' | 'tablet' | 'mobile')[];
  scheduledDate?: string;
  lastModified: string;
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
}export interface User {
  id: string; // From JWT, can remain 'id'
  _id: string; // From database
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
  isVerified?: boolean;
  isActive?: boolean;
}

export interface Store {
  _id: string;
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
  _id: string;
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
  _id: string;
  store: Store;
  amount: number;
  cashbackEarned: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  date: string;
  orderId: string;
}

export interface WithdrawalRequest {
  _id: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm' | 'voucher';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: string;
  completedDate?: string;
}

export interface Category {
  _id: string;
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
    _id: string;
    name: string;
    email: string;
    earnings: number;
    status: string;
    joinedDate: string;
  }>;
}

export interface NotificationData {
  _id: string;
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

export interface ContentSection {
  _id: string;
  name: string;
  type: 'hero' | 'featured' | 'highlighted' | 'banner' | 'testimonial';
  status: 'active' | 'inactive' | 'scheduled';
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  position: number;
  devices: ('desktop' | 'tablet' | 'mobile')[];
  scheduledDate?: string;
  lastModified: string;
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