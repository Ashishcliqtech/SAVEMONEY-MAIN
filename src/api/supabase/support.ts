import { supabase } from '../../lib/supabase';

export interface SupportTicket {
  id?: string;
  ticketNumber?: string;
  userId: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: 'cashback' | 'withdrawal' | 'account' | 'technical' | 'general';
  assignedTo?: string;
  attachments?: string[];
}

export interface SupportResponse {
  ticketId: string;
  message: string;
  isAdminResponse: boolean;
  attachments?: string[];
}

export const supportService = {
  // Get user tickets
  async getUserTickets(userId: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        responses:support_responses(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all tickets (admin only)
  async getAllTickets(filters: any = {}) {
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        user:users(name, email),
        assigned_user:users!assigned_to(name),
        responses:support_responses(*)
      `);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Create support ticket
  async createTicket(ticketData: SupportTicket): Promise<SupportTicket> {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: ticketData.userId,
        subject: ticketData.subject,
        message: ticketData.message,
        priority: ticketData.priority,
        category: ticketData.category,
        attachments: ticketData.attachments,
      })
      .select()
      .single();

    if (error) throw error;
    return data as SupportTicket;
  },

  // Update ticket status
  async updateTicketStatus(
    id: string, 
    status: SupportTicket['status'],
    assignedTo?: string
  ): Promise<void> {
    const updates: any = { status };
    if (assignedTo) updates.assigned_to = assignedTo;

    const { error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  // Add response to ticket
  async addResponse(responseData: SupportResponse): Promise<void> {
    const { error } = await supabase
      .from('support_responses')
      .insert({
        ticket_id: responseData.ticketId,
        message: responseData.message,
        is_admin_response: responseData.isAdminResponse,
        attachments: responseData.attachments,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

    if (error) throw error;

    // Update ticket status to in-progress if it was open
    if (responseData.isAdminResponse) {
      await supabase
        .from('support_tickets')
        .update({ status: 'in-progress' })
        .eq('id', responseData.ticketId)
        .eq('status', 'open');
    }
  },

  // Get ticket statistics (admin only)
  async getTicketStats() {
    const { data, error } = await supabase.rpc('get_support_statistics');
    if (error) throw error;
    return data;
  },
};