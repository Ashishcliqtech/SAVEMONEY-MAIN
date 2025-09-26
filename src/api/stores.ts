import { apiClient } from './client';
import { Store } from '../types';

export interface StoresResponse {
  stores: Store[];
  total: number;
  page: number;
  limit: number;
}

export interface StoreFilters {
  category?: string;
  search?: string;
  sortBy?: 'name' | 'cashback' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const storesApi = {
  getStores: (filters?: StoreFilters): Promise<StoresResponse> =>
    apiClient.get('/stores', { params: filters }),

  getStore: (id: string): Promise<Store> =>
    apiClient.get(`/stores/${id}`),

  getPopularStores: (): Promise<Store[]> =>
    apiClient.get('/stores/popular'),

  getFeaturedStores: (): Promise<Store[]> =>
    apiClient.get('/stores/featured'),

  searchStores: (query: string): Promise<Store[]> =>
    apiClient.get('/stores/search', { params: { q: query } }),
};