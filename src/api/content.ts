import { apiClient } from './client';
import { ContentSection } from '../types';


// Assuming these types are in `src/types`
export interface GetAllContentParams {
  page?: string;
}

export interface CreateContentSectionPayload {
  title: string;
  page: string;
  content: string; 
  imageUrl?: File;
}

export interface UpdateContentSectionPayload {
  title?: string;
  page?: string;
  content?: string;
  imageUrl?: File;
}

export const contentApi = {
  // Public
  getAllContent: (params: GetAllContentParams = {}): Promise<ContentSection[]> =>
    apiClient.get('/content', { params }).then(res => res.data),

  // Admin
  createContentSection: (payload: CreateContentSectionPayload): Promise<ContentSection> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return apiClient.post('/admin/content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
  
  updateContentSection: (id: string, payload: UpdateContentSectionPayload): Promise<ContentSection> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return apiClient.put(`/admin/content/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  deleteContentSection: (id: string): Promise<void> =>
    apiClient.delete(`/admin/content/${id}`).then(res => res.data),
};
