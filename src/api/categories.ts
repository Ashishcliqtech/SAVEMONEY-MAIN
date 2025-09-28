import { apiClient } from './client';
import { Category, Offer, Store } from '../types';

// Assuming these types are in `src/types`
export interface CreateCategoryPayload {
    name: string;
    description: string;
}

export interface UpdateCategoryPayload {
    name?: string;
    description?: string;
}


export const categoriesApi = {
  // Public
  getAllCategories: (): Promise<Category[]> =>
    apiClient.get('/categories').then(res => res.data),

  getCategoryById: (id: string): Promise<Category> =>
    apiClient.get(`/categories/${id}`).then(res => res.data),

  getOffersByCategory: (id: string): Promise<Offer[]> =>
    apiClient.get(`/categories/${id}/offers`).then(res => res.data),

  getStoresByCategory: (id: string): Promise<Store[]> =>
    apiClient.get(`/categories/${id}/stores`).then(res => res.data),

  // Admin
  createCategory: (payload: CreateCategoryPayload): Promise<Category> =>
    apiClient.post('/admin/categories', payload).then(res => res.data),

  updateCategory: (id: string, payload: UpdateCategoryPayload): Promise<Category> =>
    apiClient.put(`/admin/categories/${id}`, payload).then(res => res.data),

  deleteCategory: (id: string): Promise<void> =>
    apiClient.delete(`/admin/categories/${id}`).then(res => res.data),
};
