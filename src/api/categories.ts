import { apiClient } from './client';
import { Category, Offer, Store } from '../types';

export const categoriesApi = {
  getCategories: (): Promise<Category[]> =>
    apiClient.get('/categories'),

  getCategory: (id: string): Promise<Category> =>
    apiClient.get(`/categories/${id}`),

  getCategoryOffers: (id: string, page?: number, limit?: number): Promise<{
    offers: Offer[];
    total: number;
  }> =>
    apiClient.get(`/categories/${id}/offers`, { params: { page, limit } }),

  getCategoryStores: (id: string): Promise<Store[]> =>
    apiClient.get(`/categories/${id}/stores`),
};