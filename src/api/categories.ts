import { apiClient } from './client';
import { Category } from '../types';

export const categoriesApi = {
  getCategories: (): Promise<Category[]> =>
    apiClient.get('/categories'),

  getCategory: (id: string): Promise<Category> =>
    apiClient.get(`/categories/${id}`),

  getCategoryOffers: (id: string, page?: number, limit?: number): Promise<{
    offers: any[];
    total: number;
  }> =>
    apiClient.get(`/categories/${id}/offers`, { params: { page, limit } }),

  getCategoryStores: (id: string): Promise<any[]> =>
    apiClient.get(`/categories/${id}/stores`),
};