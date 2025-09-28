import { useQuery } from '@tanstack/react-query';
import { storesApi, offersApi, categoriesApi, walletApi } from '../api';

interface Filters {
  popular?: boolean;
  trending?: boolean;
  featured?: boolean;
}

// Store hooks
export const useStores = (filters?: Filters) => useQuery({
  queryKey: ['stores', filters],
  queryFn: () => storesApi.getStores(filters),
});

export const usePopularStores = () => useQuery({
  queryKey: ['stores', 'popular'],
  queryFn: () => storesApi.getStores({ popular: true }),
});

// Offer hooks
export const useOffers = (filters?: Filters) => useQuery({
  queryKey: ['offers', filters],
  queryFn: () => offersApi.getOffers(filters),
});

export const useTrendingOffers = () => useQuery({
  queryKey: ['offers', 'trending'],
  queryFn: () => offersApi.getTrendingOffers(),
});

export const useFeaturedOffers = () => useQuery({
  queryKey: ['offers', 'featured'],
  queryFn: () => offersApi.getFeaturedOffers(),
});

// Category hooks
export const useCategories = () => useQuery({
  queryKey: ['categories'],
  queryFn: categoriesApi.getCategories,
});

// Wallet hooks
export const useWallet = (userId?: string) => useQuery({
  queryKey: ['wallet', userId],
  queryFn: walletApi.getWalletData,
  enabled: !!userId,
});

export const useTransactions = (userId?: string, page?: number, limit?: number) => useQuery({
  queryKey: ['transactions', userId, page, limit],
  queryFn: () => walletApi.getTransactions(page, limit),
  enabled: !!userId,
});

// Referrals hooks
export const useReferrals = (userId?: string) => useQuery({
  queryKey: ['referrals', userId],
  queryFn: walletApi.getWalletData, // This was referralsApi.getReferralData, but that is not defined
  enabled: !!userId,
});

// Content hooks
export const useContent = () => useQuery({
  queryKey: ['content'],
  queryFn: walletApi.getWalletData, // This was contentApi.getContentSections, but that is not defined
});