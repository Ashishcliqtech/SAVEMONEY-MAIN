import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../api/client';
import { NotificationSettings } from '../types';

// Hook to fetch user-specific notifications
export const useUserNotifications = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: notifications, ...queryInfo } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => apiClient.get(`/notifications/${userId}`).then(res => res.data),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => apiClient.put(`/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => apiClient.put(`/notifications/read-all`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => apiClient.delete(`/notifications/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      toast.success('Notification deleted.');
    }
  });

  return {
    notifications,
    ...queryInfo,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
  };
};

// Hook for notification settings
export const useNotificationSettings = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: settings, ...queryInfo } = useQuery<NotificationSettings, Error>({
    queryKey: ['notificationSettings', userId],
    queryFn: () => apiClient.get(`/users/${userId}/notification-settings`).then(res => res.data),
    enabled: !!userId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (updatedSettings: Partial<NotificationSettings>) => 
      apiClient.put(`/users/${userId}/notification-settings`, updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings', userId] });
      toast.success('Settings updated!');
    },
  });

  return {
    settings,
    ...queryInfo,
    updateSettings: updateSettingsMutation.mutate,
  };
};
