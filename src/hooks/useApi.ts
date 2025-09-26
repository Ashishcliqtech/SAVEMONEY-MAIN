// Re-export Supabase hooks for backward compatibility
export * from './useSupabase';

// Stores hooks
export const useStores = (filters?: any) => {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: () => Promise.resolve({
      stores: mockStores,
      total: mockStores.length,
      page: 1,
      limit: 12,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => Promise.resolve(mockStores.find(store => store.id === id) || mockStores[0]),
    enabled: !!id,
  });
};

export const usePopularStores = () => {
  return useQuery({
    queryKey: ['stores', 'popular'],
    queryFn: () => Promise.resolve(mockStores.filter(store => store.isPopular)),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Offers hooks
export const useOffers = (filters?: any) => {
  return useQuery({
    queryKey: ['offers', filters],
    queryFn: () => Promise.resolve({
      offers: mockOffers,
      total: mockOffers.length,
      page: 1,
      limit: 12,
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOffer = (id: string) => {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: () => Promise.resolve(mockOffers.find(offer => offer.id === id) || mockOffers[0]),
    enabled: !!id,
  });
};

export const useTrendingOffers = () => {
  return useQuery({
    queryKey: ['offers', 'trending'],
    queryFn: () => Promise.resolve(mockOffers.filter(offer => offer.isTrending)),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedOffers = () => {
  return useQuery({
    queryKey: ['offers', 'featured'],
    queryFn: () => Promise.resolve(mockOffers.filter(offer => offer.isExclusive)),
    staleTime: 10 * 60 * 1000,
  });
};

// Wallet hooks
export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => Promise.resolve({
      totalCashback: mockUser.totalCashback,
      availableCashback: mockUser.availableCashback,
      pendingCashback: mockUser.pendingCashback,
      withdrawnCashback: mockUser.totalCashback - mockUser.availableCashback - mockUser.pendingCashback,
    }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useTransactions = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['transactions', page, limit],
    queryFn: () => Promise.resolve({
      transactions: mockTransactions,
      total: mockTransactions.length,
    }),
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => Promise.resolve(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => Promise.resolve(mockCategories),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => Promise.resolve(mockCategories.find(cat => cat.id === id) || mockCategories[0]),
    enabled: !!id,
  });
};

// Referrals hooks
export const useReferrals = () => {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: () => Promise.resolve(mockReferralData),
  });
};

export const useGenerateReferralLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => Promise.resolve({ 
      link: mockReferralData.referralLink, 
      code: mockReferralData.referralCode 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    },
  });
};

// Notifications hooks
export const useNotifications = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: () => Promise.resolve(mockNotifications),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const markAsRead = (id: string) => {
    queryClient.setQueryData(['notifications'], (old: NotificationData[] | undefined) => {
      if (!old) return old;
      return old.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      );
    });
  };

  const markAllAsRead = () => {
    queryClient.setQueryData(['notifications'], (old: NotificationData[] | undefined) => {
      if (!old) return old;
      return old.map(notification => ({ ...notification, isRead: true }));
    });
  };

  const deleteNotification = (id: string) => {
    queryClient.setQueryData(['notifications'], (old: NotificationData[] | undefined) => {
      if (!old) return old;
      return old.filter(notification => notification.id !== id);
    });
  };

  return {
    ...query,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};