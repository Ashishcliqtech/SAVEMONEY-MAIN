import express from 'express';
import { supabase } from '../config/database';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: notifications, error, count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw createError('Failed to fetch notifications', 500);
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}));

// Mark notification as read
router.patch('/:id/read', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { data: notification, error } = await supabase
    .from('notifications')
    .update({ 
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw createError('Failed to mark notification as read', 500);
  }

  res.json({
    success: true,
    message: 'Notification marked as read',
    notification,
  });
}));

// Mark all notifications as read
router.patch('/mark-all-read', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;

  const { error } = await supabase
    .from('notifications')
    .update({ 
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    throw createError('Failed to mark notifications as read', 500);
  }

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
}));

// Delete notification
router.delete('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw createError('Failed to delete notification', 500);
  }

  res.json({
    success: true,
    message: 'Notification deleted successfully',
  });
}));

// Admin: Send notification to users
router.post('/admin/send', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const {
    title,
    message,
    type,
    targetAudience,
    channels,
    scheduledDate,
    imageUrl,
    actionUrl,
    metadata,
  } = req.body;

  // Get target users based on audience
  let userQuery = supabase.from('users').select('id');

  switch (targetAudience) {
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
  if (userError) {
    throw createError('Failed to fetch target users', 500);
  }

  // Create notifications for all target users
  const notifications = users.map(user => ({
    user_id: user.id,
    title,
    message,
    type,
    action_url: actionUrl,
    image_url: imageUrl,
    metadata,
  }));

  const { error: notificationError } = await supabase
    .from('notifications')
    .insert(notifications);

  if (notificationError) {
    throw createError('Failed to send notifications', 500);
  }

  // Save template for tracking
  const { data: template, error: templateError } = await supabase
    .from('notification_templates')
    .insert({
      title,
      message,
      type,
      target_audience: targetAudience,
      channels,
      status: scheduledDate ? 'scheduled' : 'sent',
      scheduled_date: scheduledDate,
      sent_count: notifications.length,
    })
    .select()
    .single();

  if (templateError) {
    console.error('Failed to save notification template:', templateError);
  }

  res.json({
    success: true,
    message: 'Notifications sent successfully',
    sentCount: notifications.length,
    template,
  });
}));

// Admin: Get notification templates
router.get('/admin/templates', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { data: templates, error } = await supabase
    .from('notification_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw createError('Failed to fetch notification templates', 500);
  }

  res.json({
    success: true,
    templates,
  });
}));

// Admin: Get notification analytics
router.get('/admin/analytics', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { data: analytics, error } = await supabase.rpc('get_notification_analytics');
  
  if (error) {
    throw createError('Failed to fetch notification analytics', 500);
  }

  res.json({
    success: true,
    analytics,
  });
}));

export default router;