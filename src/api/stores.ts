import { apiClient } from './client';
import { Store } from '../types';

// Assuming these types are in `src/types`
export interface GetAllStoresParams {
    page?: number;
    limit?: number;
    category?: string;
}

export interface SearchStoresParams {
    q: string;
}

export interface CreateStorePayload {
    name: string;
    description: string;
    url: string;
    category: string;
    isPopular: boolean;
    isFeatured: boolean;
    logo: File;
}

export interface UpdateStorePayload {
    name?: string;
    description?: string;
    url?: string;
    category?: string;
    isPopular?: boolean;
    isFeatured?: boolean;
    logo?: File;
}

export interface StorePaginatedResponse {
  stores: Store[];
  totalPages: number;
  currentPage: number;
}

export const storesApi = {
  // Public
  getAllStores: (params: GetAllStoresParams): Promise<StorePaginatedResponse> =>
    apiClient.get('/stores', { params }).then(res => res.data),

  getPopularStores: (): Promise<Store[]> =>
    apiClient.get('/stores/popular').then(res => res.data),

  getFeaturedStores: (): Promise<Store[]> =>
    apiClient.get('/stores/featured').then(res => res.data),

  searchStores: (params: SearchStoresParams): Promise<Store[]> =>
    apiClient.get('/stores/search', { params }).then(res => res.data),

  getStoreById: (id: string): Promise<Store> =>
    apiClient.get(`/stores/${id}`).then(res => res.data),

  // Admin
  createStore: (payload: CreateStorePayload): Promise<Store> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return apiClient.post('/admin/stores', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
  
  updateStore: (id: string, payload: UpdateStorePayload): Promise<Store> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return apiClient.put(`/admin/stores/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  deleteStore: (id: string): Promise<void> =>
    apiClient.delete(`/admin/stores/${id}`).then(res => res.data),
};
