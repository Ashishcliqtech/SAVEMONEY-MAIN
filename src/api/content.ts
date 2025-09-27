import { apiClient } from './client';
import { ContentSection } from '../types';

// The backend expects multipart/form-data, so we need to build it manually
const buildFormData = (data: Partial<ContentSection>, imageFile?: File): FormData => {
  const formData = new FormData();

  // Flatten the nested 'content' object as the backend expects
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'content' && typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([contentKey, contentValue]) => {
        if (contentValue !== null && contentValue !== undefined) {
          formData.append(`content[${contentKey}]`, String(contentValue));
        }
      });
    } else if (Array.isArray(value)) {
        value.forEach(item => formData.append(`${key}[]`, item));
    }
    else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (imageFile) {
    formData.append('imageUrl', imageFile);
  }

  return formData;
};

export const contentApi = {
  getContentSections: (): Promise<ContentSection[]> =>
    apiClient.get('/content').then(res => res.data),

  createContentSection: (data: Partial<ContentSection>, imageFile?: File): Promise<ContentSection> => {
    const formData = buildFormData(data, imageFile);
    return apiClient.post('/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  updateContentSection: (id: string, data: Partial<ContentSection>, imageFile?: File): Promise<ContentSection> => {
    const formData = buildFormData(data, imageFile);
    // Use POST for updates if the backend requires multipart/form-data, or PUT if configured
    return apiClient.put(`/content/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  deleteContentSection: (id: string): Promise<{ msg: string }> =>
    apiClient.delete(`/content/${id}`).then(res => res.data),
};
