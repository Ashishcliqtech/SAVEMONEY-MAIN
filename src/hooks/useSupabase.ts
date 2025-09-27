import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockStores, mockOffers, mockCategories, mockUser, mockTransactions, mockReferralData, mockNotifications } from '../data/mockData';
import toast from 'react-hot-toast';

// Store hooks - using mock data
export const useStores = (filters?: any) => {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredStores = [...mockStores];
      
      if (filters?.search) {
        filteredStores = filteredStores.filter(store =>
          store.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          store.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters?.category) {
        filteredStores = filteredStores.filter(store => store.category === filters.category);
      }
      
      return {
        stores: filteredStores,
        total: filteredStores.length,
        page: 1,
        limit: 12,
        totalPages: 1,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockStores.find(store => store.id === id) || mockStores[0];
    },
    enabled: !!id,
  });
};

export const usePopularStores = () => {
  return useQuery({
    queryKey: ['stores', 'popular'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockStores.filter(store => store.isPopular);
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Offer hooks - using mock data
export const useOffers = (filters?: any) => {
  return useQuery({
    queryKey: ['offers', filters],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredOffers = [...mockOffers];
      
      if (filters?.search) {
        filteredOffers = filteredOffers.filter(offer =>
          offer.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          offer.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters?.offerType) {
        filteredOffers = filteredOffers.filter(offer => offer.offerType === filters.offerType);
      }
      
      if (filters?.category) {
        filteredOffers = filteredOffers.filter(offer => offer.category === filters.category);
      }
      
      return {
        offers: filteredOffers,
        total: filteredOffers.length,
        page: 1,
        limit: 12,
        totalPages: 1,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useOffer = (id: string) => {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockOffers.find(offer => offer.id === id) || mockOffers[0];
    },
    enabled: !!id,
  });
};

export const useTrendingOffers = () => {
  return useQuery({
    queryKey: ['offers', 'trending'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockOffers.filter(offer => offer.isTrending);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedOffers = () => {
  return useQuery({
    queryKey: ['offers', 'featured'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockOffers.filter(offer => offer.isExclusive);
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Category hooks - using mock data
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockCategories;
    },
    staleTime: 30 * 60 * 1000,
  });
};

// Wallet hooks - using mock data
export const useWallet = (userId?: string) => {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        totalCashback: mockUser.totalCashback,
        availableCashback: mockUser.availableCashback,
        pendingCashback: mockUser.pendingCashback,
        withdrawnCashback: mockUser.totalCashback - mockUser.availableCashback - mockUser.pendingCashback,
      };
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useTransactions = (userId?: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['transactions', userId, page, limit],
    queryFn: async () => {
      if (!userId) return { transactions: [], total: 0, page, limit, totalPages: 0 };
      
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        transactions: mockTransactions,
        total: mockTransactions.length,
        page,
        limit,
        totalPages: 1,
      };
    },
    enabled: !!userId,
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, withdrawData }: { userId: string; withdrawData: any }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return withdrawData;
    },
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

// Notification hooks - using mock data
export const useNotifications = (userId?: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return { notifications: [], total: 0, unreadCount: 0 };
      
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        notifications: mockNotifications,
        total: mockNotifications.length,
        unreadCount: mockNotifications.filter(n => !n.isRead).length,
      };
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });

  const markAsRead = async (id: string) => {
    try {
      queryClient.setQueryData(['notifications', userId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n: any) => 
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, old.unreadCount - 1),
        };
      });
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      queryClient.setQueryData(['notifications', userId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n: any) => ({ ...n, isRead: true })),
          unreadCount: 0,
        };
      });
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      queryClient.setQueryData(['notifications', userId], (old: any) => {
        if (!old) return old;
        const notification = old.notifications.find((n: any) => n.id === id);
        return {
          ...old,
          notifications: old.notifications.filter((n: any) => n.id !== id),
          total: old.total - 1,
          unreadCount: notification && !notification.isRead ? old.unreadCount - 1 : old.unreadCount,
        };
      });
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

// Admin hooks - using mock data
export const useCreateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (storeData: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return storeData;
    },
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
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...updates };
    },
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
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete store');
    },
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (offerData: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return offerData;
    },
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
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...updates };
    },
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
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete offer');
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return categoryData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
};