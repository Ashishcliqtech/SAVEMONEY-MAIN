import { StaticImageData } from 'next/image';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Store {
  id: number;
  name: string;
  logo: string;
  description: string;
  cashback_string: string;
  categories: string[];
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  store_id: number;
  store_name: string;
  store_logo: string;
  cashback_string: string;
  valid_till: string;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string | StaticImageData;
  text: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
  icon: string;
}

export interface Referral {
  id: number;
  name: string;
  status: 'Pending' | 'Completed';
  bonus: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: 'Confirmed' | 'Pending';
}

export interface Withdrawal {
  id: number;
  method: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Processing';
}

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalOffers: number;
  pendingWithdrawals: number;
}

export interface ContentSection {
  id: string;
  slug: string;
  title: string;
  content: string | { [key: string]: any }; // Allow content to be a string or a JSON object
  page: string;
  status: 'published' | 'draft';
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  contentType?: string;
}
