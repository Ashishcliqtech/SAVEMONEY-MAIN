import { apiClient } from './client';
import { User } from '../types';

// User endpoints
export const userApi = {
  getProfile: (): Promise<User> => 
    apiClient.get('/user/profile').then(res => res.data),
};

// Admin User Management endpoints
export const adminUserApi = {
  getAll: (): Promise<User[]> =>
    apiClient.get('/admin/users').then(res => res.data),

  getById: (id: string): Promise<User> =>
    apiClient.get(`/admin/users/${id}`).then(res => res.data),

  update: (id: string, payload: { role: string }): Promise<User> =>
    apiClient.put(`/admin/users/${id}`, payload).then(res => res.data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/admin/users/${id}`).then(res => res.data),
};
