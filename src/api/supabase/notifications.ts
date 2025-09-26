import { supabase } from '../../lib/supabase';
import { NotificationData } from '../../types';

export interface NotificationTemplate {
  title: string;
  message: string;
  type: 'deal' | 'cashback' | 'withdrawal' | 'referral' | 'support' | 'system';
  targetAudience: 'all' | 'active' | 'inactive' | 'premium' | 'new';
  channels: ('push' | 'email' | 'sms' | 'in-app')[];
  scheduledDate?: string;
  imageUrl?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export const notificationService = {
  // Get user notifications
  async getUserNotifications(userId: string, page = 1, limit = 20) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.warn('Notifications table not found, using fallback:', error.message);
        throw error;
      }

      return {
        notifications: data as NotificationData[],
        total: count || 0,
        unreadCount: data?.filter(n => !n.is_read).length || 0,
      };
    } catch (error) {
      console.warn('Failed to fetch notifications from Supabase:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Send notification to users (admin only)
  async sendNotification(template: NotificationTemplate): Promise<void> {
    // Get target users based on audience
    let userQuery = supabase.from('users').select('id');

    switch (template.targetAudience) {
      case 'active':
        userQuery = userQuery.eq('is_active', true);
        break;
      case 'inactive':
        userQuery = userQuery.eq('is_active', false);
        break;
      case 'premium':
        userQuery = userQuery.gte('total_cashback', 10000);
        break;
      case 'new':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        userQuery = userQuery.gte('created_at', sevenDaysAgo.toISOString());
        break;
    }

    const { data: users, error: userError } = await userQuery;
    if (userError) throw userError;

    // Create notifications for all target users
    const notifications = users.map(user => ({
      user_id: user.id,
      title: template.title,
      message: template.message,
      type: template.type,
      action_url: template.actionUrl,
      image_url: template.imageUrl,
      metadata: template.metadata,
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) throw error;

    // Save template for tracking
    await supabase
      .from('notification_templates')
      .insert({
        title: template.title,
        message: template.message,
        type: template.type,
        target_audience: template.targetAudience,
        channels: template.channels,
        status: template.scheduledDate ? 'scheduled' : 'sent',
        scheduled_date: template.scheduledDate,
        sent_count: notifications.length,
      });
  },

  // Get notification templates (admin only)
  async getNotificationTemplates() {
    const { data, error } = await supabase
      .from('notification_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get notification analytics (admin only)
  async getNotificationAnalytics() {
    const { data, error } = await supabase.rpc('get_notification_analytics');
    if (error) throw error;
    return data;
  },
};