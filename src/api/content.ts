// src/api/content.ts
import { apiClient } from './client';
import { ContentSection } from '../types';


// Assuming these types are in `src/types`
export interface GetAllContentParams {
  page?: string;
}

export const contentApi = {
  // Public
  getAllContent: (params: GetAllContentParams = {}): Promise<ContentSection[]> =>
    apiClient.get('/content', { params }).then(res => res.data),

  // Admin
  createContentSection: (formData: FormData): Promise<ContentSection> => {
    return apiClient.post('/admin/content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  updateContentSection: (id: string, formData: FormData): Promise<ContentSection> => {
    return apiClient.put(`/admin/content/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  deleteContentSection: (id: string): Promise<void> =>
    apiClient.delete(`/admin/content/${id}`).then(res => res.data),
};