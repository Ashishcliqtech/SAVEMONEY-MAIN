import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  apiClient, 
  storesApi, 
  offersApi, 
  categoriesApi, 
  walletApi, 
  referralApi, 
  contentApi, 
  adminUserApi 
} from '../api';
import { AxiosError } from 'axios';
import { placeholderUsers, placeholderNotifications } from '../data/placeholderData';
import { Category, ContentSection, Offer, Store } from '../types';
import { RequestWithdrawalPayload } from '../api/wallet';
import { CreateCategoryPayload, UpdateCategoryPayload } from '../api/categories';

// --- API Error Handling ---
const handleApiError = (error: AxiosError | any) => {
  const errorMessage = error.response?.data?.msg || error.response?.data?.message || error.message || 'An unknown error occurred';
  toast.error(errorMessage);
  return Promise.reject(new Error(errorMessage));
};

// --- Store Hooks ---
export const useStores = (filters?: any) => useQuery({
  queryKey: ['stores', filters],
  queryFn: () => storesApi.getAllStores(filters),
  staleTime: 5 * 60 * 1000,
});

export const useStore = (id: string) => useQuery({
  queryKey: ['store', id],
  queryFn: () => storesApi.getStoreById(id),
  enabled: !!id,
});

export const usePopularStores = () => useQuery({
  queryKey: ['stores', 'popular'],
  queryFn: () => storesApi.getPopularStores(),
  staleTime: 10 * 60 * 1000,
});

// --- Offer Hooks ---
export const useOffers = (filters?: any) => useQuery({
  queryKey: ['offers', filters],
  queryFn: () => offersApi.getAllOffers(filters),
  staleTime: 2 * 60 * 1000,
});

export const useOffer = (id: string) => useQuery({
  queryKey: ['offer', id],
  queryFn: () => offersApi.getOfferById(id),
  enabled: !!id,
});

export const useTrendingOffers = () => useQuery({
  queryKey: ['offers', 'trending'],
  queryFn: () => offersApi.getTrendingOffers(),
  staleTime: 5 * 60 * 1000,
});

export const useFeaturedOffers = () => useQuery({
  queryKey: ['offers', 'featured'],
  queryFn: () => offersApi.getFeaturedOffers(),
  staleTime: 10 * 60 * 1000,
});

// --- Category Hooks ---
export const useCategories = () => useQuery<Category[], Error>({
  queryKey: ['categories'],
  queryFn: async () => {
    try {
      return await categoriesApi.getAllCategories();
    } catch (error) {
      handleApiError(error);
      return []; // Return empty array on error
    }
  },
  staleTime: 30 * 60 * 1000,
});

export const useCategory = (id: string | undefined) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const { data } = await apiClient.get(`/categories/${id}`);
        return data as { category: Category; stores: Store[]; offers: Offer[] };
      } catch (error) {
        handleApiError(error as AxiosError<any>);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// --- Wallet Hooks ---
export const useWallet = (userId?: string) => useQuery({
  queryKey: ['wallet', userId],
  queryFn: () => walletApi.getWallet(),
  enabled: !!userId,
  staleTime: 1 * 60 * 1000,
});

export const useTransactions = (userId?: string, page = 1, limit = 20) => useQuery({
  queryKey: ['transactions', userId, page, limit],
  queryFn: () => walletApi.getTransactions(page, limit),
  enabled: !!userId,
});

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (withdrawData: RequestWithdrawalPayload) => walletApi.requestWithdrawal(withdrawData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Withdrawal request submitted successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

// --- Referral Hooks ---
export const useReferrals = (userId?: string) => useQuery({
    queryKey: ['referrals', userId],
    queryFn: () => referralApi.getDashboard(),
    enabled: !!userId,
});

// --- Content Hooks ---
export const useContentSections = () => useQuery<ContentSection[], Error>({
    queryKey: ['contentSections'],
    queryFn: () => contentApi.getAllContent(),
    staleTime: 5 * 60 * 1000,
});

// --- Notification Hooks ---
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
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put(`/notifications/read-all`);
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return { ...query, markAsRead, markAllAsRead };
};

// --- Admin Hooks ---
export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    try {
      return await adminUserApi.getAll();
    } catch (error) {
      handleApiError(error);
      return placeholderUsers;
    }
  },
});

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storeData: FormData) => storesApi.createStore(storeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store created successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FormData }) => storesApi.updateStore(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store updated successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storesApi.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store deleted successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerData: FormData) => offersApi.createOffer(offerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer created successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FormData }) => offersApi.updateOffer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer updated successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => offersApi.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Offer deleted successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryData: CreateCategoryPayload) => categoriesApi.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateCategoryPayload }) => categoriesApi.updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useCreateContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => contentApi.createContentSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section created successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useUpdateContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => contentApi.updateContentSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section updated successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

export const useDeleteContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteContentSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section deleted successfully!');
    },
    onError: (error: Error) => handleApiError(error),
  });
};
