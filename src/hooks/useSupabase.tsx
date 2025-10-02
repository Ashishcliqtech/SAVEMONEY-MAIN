import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../api';
import { placeholderStores, placeholderOffers, placeholderCategories } from '../data/placeholderData';
import { Category, NotificationData, OfferFilters, StoreFilters, WithdrawalData } from '../types';

// Store hooks
export const useStores = (filters?: StoreFilters) => {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: () => apiClient.get('/stores', { params: filters }).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => apiClient.get(`/stores/${id}`).then(res => res.data),
    enabled: !!id,
  });
};

export const usePopularStores = () => {
  return useQuery({
    queryKey: ['stores', 'popular'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/stores/popular');
        return data;
      } catch (error) {
        console.error("Failed to fetch popular stores. Using placeholder data.", error);
        return placeholderStores.filter(store => store.isPopular);
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Offer hooks
export const useOffers = (filters?: OfferFilters) => {
  return useQuery({
    queryKey: ['offers', filters],
    queryFn: () => apiClient.get('/offers', { params: filters }).then(res => res.data),
    staleTime: 2 * 60 * 1000,
  });
};

export const useOffer = (id: string) => {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: () => apiClient.get(`/offers/${id}`).then(res => res.data),
    enabled: !!id,
  });
};

export const useTrendingOffers = () => {
  return useQuery({
    queryKey: ['offers', 'trending'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/offers/trending');
        return data;
      } catch (error) {
        console.error("Failed to fetch trending offers. Using placeholder data.", error);
        return placeholderOffers.filter(offer => offer.isTrending);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedOffers = (limit?: number) => {
  return useQuery({
    queryKey: ['offers', 'featured', limit],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/offers/featured', { params: { limit } });
        return data;
      } catch (error) {
        console.error("Failed to fetch featured offers. Using placeholder data.", error);
        const placeholder = placeholderOffers.filter(offer => offer.isExclusive);
        return limit ? placeholder.slice(0, limit) : placeholder;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Category hooks
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/categories');
        return data;
      } catch (error) {
        console.error("Failed to fetch categories. Using placeholder data.", error);
        return placeholderCategories;
      }
    },
    staleTime: 30 * 60 * 1000,
  });
};

// Wallet hooks
export const useWallet = (userId?: string) => {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => apiClient.get(`/wallet/${userId}`).then(res => res.data),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useTransactions = (userId?: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['transactions', userId, page, limit],
    queryFn: () => apiClient.get(`/transactions/${userId}`, { params: { page, limit } }).then(res => res.data),
    enabled: !!userId,
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (withdrawData: WithdrawalData) => 
      apiClient.post('/wallet/withdraw', withdrawData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast.success('Withdrawal request submitted successfully!');
    },
  });
};

// Admin hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/admin/users').then(res => res.data),
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notificationStats'],
    queryFn: () => apiClient.get('/admin/notifications/stats').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationData: NotificationData) => 
      apiClient.post('/admin/notifications/send', notificationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success('Notification sent successfully!');
    },
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storeData: FormData) => 
      apiClient.post('/admin/stores', storeData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store created successfully!');
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FormData }) =>
      apiClient.put(`/admin/stores/${id}`, updates, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store', variables.id] });
      toast.success('Store updated successfully!');
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/stores/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store deleted successfully!');
    },
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: (offerData: FormData) => 
          apiClient.post('/admin/offers', offerData, { headers: { 'Content-Type': 'multipart/form-data' } }),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['offers'] });
          toast.success('Offer created successfully!');
      },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FormData }) =>
      apiClient.put(`/admin/offers/${id}`, updates, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', variables.id] });
      toast.success('Offer updated successfully!');
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/offers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer deleted successfully!');
    },
  });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (categoryData: Partial<Category>) => apiClient.post('/admin/categories', categoryData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        toast.success('Category created successfully!');
      },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) => apiClient.put(`/admin/categories/${id}`, updates),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
        toast.success('Category updated successfully!');
      },
    });
};
  
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => apiClient.delete(`/admin/categories/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        toast.success('Category deleted successfully!');
      },
    });
};
