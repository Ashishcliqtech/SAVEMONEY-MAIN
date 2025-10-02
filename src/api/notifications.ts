import { apiClient } from './client';
import { Notification, NotificationSettings, NotificationData } from '../types';

// User-Facing API Calls

export const getNotifications = (userId: string): Promise<Notification[]> => {
    return apiClient.get(`/notifications/${userId}`);
};

export const getNotificationSettings = (): Promise<NotificationSettings> => {
    return apiClient.get('/user/notifications/settings');
};

export const updateNotificationSettings = (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    return apiClient.put('/user/notifications/settings', settings);
};

export const markNotificationAsRead = (id: string): Promise<{ msg: string }> => {
    return apiClient.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = (): Promise<{ msg: string }> => {
    return apiClient.put('/notifications/read-all');
};

export const markNotificationAsClicked = (id: string): Promise<{ msg: string }> => {
    return apiClient.post(`/notifications/${id}/click`);
};

// Admin API Calls

export const sendNotification = (notificationData: NotificationData): Promise<Notification> => {
    return apiClient.post('/admin/notifications/send', notificationData);
};

export const getNotificationStats = (): Promise<any> => {
    return apiClient.get('/admin/notifications/stats');
};
