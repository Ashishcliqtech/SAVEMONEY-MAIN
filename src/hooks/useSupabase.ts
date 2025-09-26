import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  storeService, 
  offerService, 
  categoryService, 
  userService,
  walletService,
  notificationService,
  contentService,
  supportService,
  analyticsService
} from '../api/supabase';
import { mockStores, mockOffers, mockCategories, mockUser, mockTransactions, mockReferralData, mockNotifications } from '../data/mockData';
import toast from 'react-hot-toast';

// Store hooks
export const useStores = (filters?: any) => {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: async () => {
      try {
        return await storeService.getStores(filters);
      } catch (error) {
        console.warn('Supabase stores table not found, using mock data');
        return {
          stores: mockStores,
          total: mockStores.length,
          page: 1,
          limit: 12,
          totalPages: 1,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      try {
        return await storeService.getStore(id);
      } catch (error) {
        console.warn('Using mock data for store:', error);
        return mockStores.find(store => store.id === id) || mockStores[0];
      }
    },
    enabled: !!id,
  });
};

export const usePopularStores = () => {
  return useQuery({
    queryKey: ['stores', 'popular'],
    queryFn: async () => {
      try {
        return await storeService.getPopularStores();
      } catch (error) {
        console.warn('Supabase stores table not found, using mock data for popular stores');
        return mockStores.filter(store => store.isPopular);
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeService.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create store');
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      storeService.updateStore(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update store');
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeService.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete store');
    },
  });
};

// Offer hooks
export const useOffers = (filters?: any) => {
  return useQuery({
    queryKey: ['offers', filters],
    queryFn: async () => {
      try {
        return await offerService.getOffers(filters);
      } catch (error) {
        console.warn('Supabase offers table not found, using mock data');
        return {
          offers: mockOffers,
          total: mockOffers.length,
          page: 1,
          limit: 12,
          totalPages: 1,
        };
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useOffer = (id: string) => {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      try {
        return await offerService.getOffer(id);
      } catch (error) {
        console.warn('Using mock data for offer:', error);
        return mockOffers.find(offer => offer.id === id) || mockOffers[0];
      }
    },
    enabled: !!id,
  });
};

export const useTrendingOffers = () => {
  return useQuery({
    queryKey: ['offers', 'trending'],
    queryFn: async () => {
      try {
        return await offerService.getTrendingOffers();
      } catch (error) {
        console.warn('Using mock data for trending offers:', error);
        return mockOffers.filter(offer => offer.isTrending);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedOffers = () => {
  return useQuery({
    queryKey: ['offers', 'featured'],
    queryFn: async () => {
      try {
        return await offerService.getFeaturedOffers();
      } catch (error) {
        console.warn('Supabase offers table not found, using mock data for featured offers');
        return mockOffers.filter(offer => offer.isExclusive);
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: offerService.createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create offer');
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      offerService.updateOffer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update offer');
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: offerService.deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete offer');
    },
  });
};

// Category hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await categoryService.getCategories();
      } catch (error) {
        console.warn('Supabase categories table not found, using mock data');
        return mockCategories;
      }
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
};

// Wallet hooks
export const useWallet = (userId: string) => {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const walletData = await walletService.getWalletData(userId);
        return walletData || {
          totalCashback: 0,
          availableCashback: 0,
          pendingCashback: 0,
          withdrawnCashback: 0,
        };
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
        return {
          totalCashback: 0,
          availableCashback: 0,
          pendingCashback: 0,
          withdrawnCashback: 0,
        };
      }
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useTransactions = (userId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['transactions', userId, page, limit],
    queryFn: async () => {
      if (!userId) return { transactions: [], total: 0, page, limit, totalPages: 0 };
      
      try {
        return await walletService.getTransactions(userId, page, limit);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return {
          transactions: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
    },
    enabled: !!userId,
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, withdrawData }: { userId: string; withdrawData: any }) =>
      walletService.createWithdrawal(userId, withdrawData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast.success('Withdrawal request submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit withdrawal request');
    },
  });
};

// Notification hooks
export const useNotifications = (userId: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return { notifications: [], total: 0, unreadCount: 0 };
      
      try {
        return await notificationService.getUserNotifications(userId);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return {
          notifications: [],
          total: 0,
          unreadCount: 0,
        };
      }
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return {
    ...query,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

// Content management hooks
export const useContentSections = () => {
  return useQuery({
    queryKey: ['content-sections'],
    queryFn: () => contentService.getContentSections(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveContentSections = () => {
  return useQuery({
    queryKey: ['content-sections', 'active'],
    queryFn: () => contentService.getActiveContentSections(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateContentSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contentService.createContentSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sections'] });
      toast.success('Content section created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create content section');
    },
  });
};

// Admin analytics hooks
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => analyticsService.getAdminStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserAnalytics = (filters?: any) => {
  return useQuery({
    queryKey: ['user-analytics', filters],
    queryFn: () => analyticsService.getUserAnalytics(filters),
    staleTime: 10 * 60 * 1000,
  });
};