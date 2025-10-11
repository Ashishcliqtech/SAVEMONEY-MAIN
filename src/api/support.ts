import { apiClient } from './client';
import {
  SupportTicket,
  SupportTicketWithMessages,
  AdminSupportTicketWithMessages,
  PaginatedAdminSupportTickets,
  Message,
  AdminMessage,
} from '../types/support';

// User-facing functions
export const createSupportTicket = async (data: { subject: string; message: string }): Promise<SupportTicket> => {
  const response = await apiClient.post('/support/tickets', data);
  return response.data;
};

export const getUserSupportTickets = async (): Promise<SupportTicket[]> => {
  const response = await apiClient.get('/support/tickets');
  return response.data;
};

export const getSupportTicketById = async (id: string): Promise<SupportTicketWithMessages> => {
  const response = await apiClient.get(`/support/tickets/${id}`);
  return response.data;
};

export const addMessageToTicket = async (id: string, data: { message: string }): Promise<Message> => {
  const response = await apiClient.post(`/support/tickets/${id}/messages`, data);
  return response.data;
};

// Admin-facing functions
export const getAllSupportTickets = async (params: { status?: 'open' | 'closed'; page?: number; limit?: number }): Promise<PaginatedAdminSupportTickets> => {
  const response = await apiClient.get('/admin/support/tickets', { params });
  return response.data;
};

export const getAdminSupportTicketById = async (id: string): Promise<AdminSupportTicketWithMessages> => {
  const response = await apiClient.get(`/admin/support/tickets/${id}`);
  return response.data;
};

export const updateSupportTicket = async (id: string, data: { status: 'open' | 'closed' }): Promise<SupportTicket> => {
  const response = await apiClient.patch(`/admin/support/tickets/${id}`, data);
  return response.data;
};

export const addAdminMessageToTicket = async (id: string, data: { message: string }): Promise<AdminMessage> => {
  const response = await apiClient.post(`/admin/support/tickets/${id}/messages`, data);
  return response.data;
};
