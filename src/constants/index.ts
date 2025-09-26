export const ROUTES = {
  HOME: '/',
  STORES: '/stores',
  CATEGORIES: '/categories',
  OFFERS: '/offers',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  WALLET: '/wallet',
  REFERRALS: '/referrals',
  PROFILE: '/profile',
  SUPPORT: '/support',
  ADMIN: '/admin',
  STORE_DETAIL: '/stores/:id',
  CATEGORY_DETAIL: '/categories/:id',
  OFFER_DETAIL: '/offers/:id',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_OTP: '/auth/verify-otp',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    DASHBOARD: '/users/dashboard',
  },
  STORES: {
    LIST: '/stores',
    DETAIL: '/stores/:id',
    POPULAR: '/stores/popular',
  },
  OFFERS: {
    LIST: '/offers',
    DETAIL: '/offers/:id',
    TRENDING: '/offers/trending',
    EXCLUSIVE: '/offers/exclusive',
  },
  CASHBACK: {
    WALLET: '/cashback/wallet',
    TRANSACTIONS: '/cashback/transactions',
    WITHDRAW: '/cashback/withdraw',
    WITHDRAWAL_HISTORY: '/cashback/withdrawals',
  },
  REFERRALS: {
    DATA: '/referrals',
    GENERATE_LINK: '/referrals/generate-link',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
  SEARCH: {
    OFFERS: '/search/offers',
    STORES: '/search/stores',
    SUGGESTIONS: '/search/suggestions',
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    STORES: '/admin/stores',
    OFFERS: '/admin/offers',
    WITHDRAWALS: '/admin/withdrawals',
  },
} as const;

export const CASHBACK_RATES = {
  MIN: 0.5,
  MAX: 25,
  AVERAGE: 3.5,
} as const;

export const WITHDRAWAL_METHODS = [
  { id: 'upi', label: 'UPI', icon: 'smartphone', minAmount: 10 },
  { id: 'bank', label: 'Bank Transfer', icon: 'building-bank', minAmount: 50 },
  { id: 'paytm', label: 'Paytm Wallet', icon: 'wallet', minAmount: 10 },
  { id: 'voucher', label: 'Gift Voucher', icon: 'gift', minAmount: 100 },
] as const;

export const SOCIAL_LOGINS = [
  { id: 'google', name: 'Google', icon: 'chrome' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook' },
  { id: 'apple', name: 'Apple', icon: 'apple' },
] as const;

export const POPULAR_CATEGORIES = [
  { id: 'fashion', name: 'Fashion', icon: 'shirt' },
  { id: 'electronics', name: 'Electronics', icon: 'smartphone' },
  { id: 'travel', name: 'Travel', icon: 'plane' },
  { id: 'food', name: 'Food & Dining', icon: 'utensils' },
  { id: 'beauty', name: 'Beauty', icon: 'sparkles' },
  { id: 'home', name: 'Home & Garden', icon: 'home' },
  { id: 'books', name: 'Books', icon: 'book-open' },
  { id: 'health', name: 'Health', icon: 'heart' },
] as const;

export const TOAST_DURATION = 4000;
export const ANIMATION_DURATION = 300;
export const DEBOUNCE_DELAY = 300;
export const PAGE_SIZE = 20;