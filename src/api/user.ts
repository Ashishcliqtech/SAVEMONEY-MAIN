import { apiClient } from './client';
import { User, NotificationPreferences } from '../types';


const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    return error.response.data.message || defaultMessage;
  } else if (error.request) {
    return 'No response from server. Please check your network connection.';
  } else {
    return error.message || defaultMessage;
  }
};

export const userApi = {
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/user/profile');
      // The backend is likely returning _id, but the frontend expects id.
      // Let's manually map it to ensure consistency with the User type.
      const userData = response.data;
      if (userData && userData._id && !userData.id) {
        userData.id = userData._id;
      }
      return userData;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user profile.'));
    }
  },

  updateProfile: async (payload: { name?: string; phone?: string; avatar?: string }): Promise<User> => {
    try {
      const response = await apiClient.put('/user/profile', payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update user profile.'));
    }
  },

  updateNotificationPreferences: async (payload: NotificationPreferences): Promise<User> => {
    try {
      const response = await apiClient.put('/user/notifications', payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update notification preferences.'));
    }
  },

  deleteAccount: async (): Promise<{ msg: string }> => {
    try {
      const response = await apiClient.delete('/user');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete user account.'));
    }
  },
};

export const adminUserApi = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch users.'));
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user.'));
    }
  },

  update: async (id: string, payload: { role: string }): Promise<User> => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update user.'));
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete user.'));
    }
  },
};
