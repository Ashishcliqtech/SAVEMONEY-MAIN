import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storesApi, offersApi, categoriesApi, walletApi, referralsApi, contentApi } from '../api';
import toast from 'react-hot-toast';

// Store hooks
export const useStores = (filters?: any) => useQuery({
  queryKey: ['stores', filters],
  queryFn: () => storesApi.getStores(filters),
});

export const usePopularStores = () => useQuery({
  queryKey: ['stores', 'popular'],
  queryFn: storesApi.getPopularStores,
});

// Offer hooks
export const useOffers = (filters?: any) => useQuery({
  queryKey: ['offers', filters],
  queryFn: () => offersApi.getOffers(filters),
});

export const useTrendingOffers = () => useQuery({
  queryKey: ['offers', 'trending'],
  queryFn: offersApi.getTrendingOffers,
});

export const useFeaturedOffers = () => useQuery({
  queryKey: ['offers', 'featured'],
  queryFn: offersApi.getFeaturedOffers,
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

export const useTransactions = (userId?: string) => useQuery({
  queryKey: ['transactions', userId],
  queryFn: walletApi.getTransactions,
  enabled: !!userId,
});

// Referrals hooks
export const useReferrals = (userId?: string) => useQuery({
  queryKey: ['referrals', userId],
  queryFn: referralsApi.getReferralData,
  enabled: !!userId,
});

// Content hooks
export const useContent = () => useQuery({
  queryKey: ['content'],
  queryFn: contentApi.getContentSections,
});