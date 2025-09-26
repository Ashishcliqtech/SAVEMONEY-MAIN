import express from 'express';
import { supabase } from '../config/database';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';
import { validate, supportSchemas } from '../middleware/validation';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { generateUniqueId } from '../utils/validation';

const router = express.Router();

// Get user tickets
router.get('/tickets', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;

  const { data: tickets, error } = await supabase
    .from('support_tickets')
    .select(`
      *,
      responses:support_responses(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw createError('Failed to fetch support tickets', 500);
  }

  res.json({
    success: true,
    tickets,
  });
}));

// Create support ticket
router.post('/tickets', authenticateToken, validate(supportSchemas.createTicket), asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const { subject, message, priority, category, attachments } = req.body;

  // Generate ticket number
  const ticketNumber = `TKT-${generateUniqueId().toUpperCase()}`;

  const { data: ticket, error } = await supabase
    .from('support_tickets')
    .insert({
      ticket_number: ticketNumber,
      user_id: userId,
      subject,
      message,
      priority,
      category,
      attachments,
      status: 'open',
    })
    .select()
    .single();

  if (error) {
    throw createError('Failed to create support ticket', 500);
  }

  // Create notification for admins
  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .in('role', ['admin', 'moderator']);

  if (admins && admins.length > 0) {
    const adminNotifications = admins.map(admin => ({
      user_id: admin.id,
      title: 'New Support Ticket',
      message: `New ${priority} priority ticket: ${subject}`,
      type: 'support',
      action_url: `/admin/support/tickets/${ticket.id}`,
    }));

    await supabase
      .from('notifications')
      .insert(adminNotifications);
  }

  res.status(201).json({
    success: true,
    message: 'Support ticket created successfully',
    ticket,
  });
}));

// Add response to ticket
router.post('/tickets/:id/responses', authenticateToken, validate(supportSchemas.addResponse), asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { message, attachments } = req.body;

  // Check if user owns the ticket or is admin
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .select('user_id')
    .eq('id', id)
    .single();

  if (ticketError || !ticket) {
    throw createError('Ticket not found', 404);
  }

  const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
  if (ticket.user_id !== userId && !isAdmin) {
    throw createError('Access denied', 403);
  }

  // Add response
  const { data: response, error: responseError } = await supabase
    .from('support_responses')
    .insert({
      ticket_id: id,
      user_id: userId,
      message,
      attachments,
      is_admin_response: isAdmin,
    })
    .select()
    .single();

  if (responseError) {
    throw createError('Failed to add response', 500);
  }

  // Update ticket status if admin response
  if (isAdmin) {
    await supabase
      .from('support_tickets')
      .update({ 
        status: 'in-progress',
        assigned_to: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'open');
  }

  res.status(201).json({
    success: true,
    message: 'Response added successfully',
    response,
  });
}));

// Admin: Get all tickets
router.get('/admin/tickets', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    category,
    assignedTo,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = req.query;

  let query = supabase
    .from('support_tickets')
    .select(`
      *,
      user:users(name, email),
      assigned_user:users!assigned_to(name),
      responses:support_responses(*)
    `, { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  if (priority) {
    query = query.eq('priority', priority);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (assignedTo) {
    query = query.eq('assigned_to', assignedTo);
  }

  // Sorting
  query = query.order(sortBy as string, { ascending: sortOrder === 'asc' });

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const from = (pageNum - 1) * limitNum;
  const to = from + limitNum - 1;

  query = query.range(from, to);

  const { data: tickets, error, count } = await query;

  if (error) {
    throw createError('Failed to fetch support tickets', 500);
  }

  res.json({
    success: true,
    tickets,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limitNum),
    },
  });
}));

// Admin: Update ticket status
router.patch('/admin/tickets/:id', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (assignedTo) {
    updates.assigned_to = assignedTo;
  }

  const { data: ticket, error } = await supabase
    .from('support_tickets')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      user:users(name, email),
      assigned_user:users!assigned_to(name)
    `)
    .single();

  if (error) {
    throw createError('Failed to update ticket status', 500);
  }

  res.json({
    success: true,
    message: 'Ticket updated successfully',
    ticket,
  });
}));

// Admin: Get support statistics
router.get('/admin/stats', authenticateToken, requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const { data: stats, error } = await supabase.rpc('get_support_statistics');
  
  if (error) {
    throw createError('Failed to fetch support statistics', 500);
  }

  res.json({
    success: true,
    stats,
  });
}));

export default router;