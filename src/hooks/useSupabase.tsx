import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../api';
import { AxiosError } from 'axios';
import { placeholderStores, placeholderOffers, placeholderCategories, placeholderUsers, placeholderNotifications } from '../data/placeholderData';

// Type definitions
interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  isPopular: boolean;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  offerType: string;
  category: string;
  isTrending: boolean;
  isExclusive: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Notification {
  id: string;
  isRead: boolean;
  message: string;
  createdAt: string;
  type: 'offer' | 'system' | 'wallet';
}

interface StoreFilters {
  search?: string;
  category?: string;
}

interface OfferFilters {
  search?: string;
  offerType?: string;
  category?: string;
}

interface WithdrawalData {
    amount: number;
    paymentMethod: string;
}

interface ApiError {
  message: string;
}

// API Error Handling
const handleApiError = (error: AxiosError<ApiError>) => {
  if (toast.custom) {
    toast.custom((t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {error.response?.data?.message || error.message || 'An unknown error occurred'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Close
          </button>
        </div>
      </div>
    ));
  } else {
    toast.error(error.response?.data?.message || error.message || 'An unknown error occurred');
  }

  return Promise.reject(new Error(error.response?.data?.message || error.message || 'An unknown error occurred'));
};


// Store hooks
export const useStores = (filters?: StoreFilters) => {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/stores', { params: filters });
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get(`/stores/${id}`);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
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
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/offers', { params: filters });
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
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
        const { data } = await apiClient.get(`/offers/${id}`);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
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

export const useFeaturedOffers = () => {
  return useQuery({
    queryKey: ['offers', 'featured'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/offers/featured');
        return data;
      } catch (error) {
        console.error("Failed to fetch featured offers. Using placeholder data.", error);
        return placeholderOffers.filter(offer => offer.isExclusive);
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
    queryFn: async () => {
      if (!userId) return null;
      try {
        const { data } = await apiClient.get(`/wallet/${userId}`);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
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
      try {
        const { data } = await apiClient.get(`/transactions/${userId}`, { params: { page, limit } });
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    enabled: !!userId,
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ withdrawData }: { withdrawData: WithdrawalData }) => {
      try {
        const { data } = await apiClient.post('/wallet/withdraw', withdrawData);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast.success('Withdrawal request submitted successfully!');
    },
  });
};

// Notification hooks
export const useNotifications = (userId?: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return { notifications: [], total: 0, unreadCount: 0 };
      try {
        const { data } = await apiClient.get(`/notifications/${userId}`);
        return data;
      } catch (error) {
        console.error("Failed to fetch notifications. Using placeholder data.", error);
        return {
          notifications: placeholderNotifications,
          total: placeholderNotifications.length,
          unreadCount: placeholderNotifications.filter(n => !n.isRead).length,
        };
      }
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });

  const markAsRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Don't show error toast for this action
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put(`/notifications/read-all`);
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Don't show error toast for this action
    }
  };

  return {
    ...query,
    markAsRead,
    markAllAsRead,
  };
};

// Admin hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/users');
        return data;
      } catch (error) {
        console.error("Failed to fetch users. Using placeholder data.", error);
        return placeholderUsers;
      }
    },
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (storeData: Partial<Store>) => {
      try {
        const { data } = await apiClient.post('/stores', storeData);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store created successfully!');
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Store> }) => {
      try {
        const { data } = await apiClient.put(`/stores/${id}`, updates);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store updated successfully!');
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.delete(`/stores/${id}`);
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store deleted successfully!');
    },
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (offerData: Partial<Offer>) => {
      try {
        const { data } = await apiClient.post('/offers', offerData);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer created successfully!');
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Offer> }) => {
      try {
        const { data } = await apiClient.put(`/offers/${id}`, updates);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer updated successfully!');
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.delete(`/offers/${id}`);
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer deleted successfully!');
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      try {
        const { data } = await apiClient.post('/categories', categoryData);
        return data;
      } catch (error) {
        return handleApiError(error as AxiosError<ApiError>);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
  });
};