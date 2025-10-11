import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSupportTicket,
  getUserSupportTickets,
  getSupportTicketById,
  addMessageToTicket,
  getAllSupportTickets,
  getAdminSupportTicketById,
  updateSupportTicket,
  addAdminMessageToTicket,
} from '../api/support';

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSupportTickets'] });
    },
  });
};

export const useGetUserSupportTickets = () => {
  return useQuery({
    queryKey: ['userSupportTickets'],
    queryFn: getUserSupportTickets,
  });
};

export const useGetSupportTicketById = (id: string) => {
  return useQuery({
    queryKey: ['supportTicket', id],
    queryFn: () => getSupportTicketById(id),
    enabled: !!id,
  });
};

export const useAddMessageToTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; data: { message: string } }) => addMessageToTicket(params.id, params.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supportTicket', variables.id] });
    },
  });
};

export const useGetAllSupportTickets = (params: { status?: 'open' | 'closed'; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['allSupportTickets', params],
    queryFn: () => getAllSupportTickets(params),
  });
};

export const useGetAdminSupportTicketById = (id: string) => {
  return useQuery({
    queryKey: ['adminSupportTicket', id],
    queryFn: () => getAdminSupportTicketById(id),
    enabled: !!id,
  });
};

export const useUpdateSupportTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; data: { status: 'open' | 'closed' } }) =>
      updateSupportTicket(params.id, params.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allSupportTickets'] });
      queryClient.invalidateQueries({ queryKey: ['adminSupportTicket', variables.id] });
    },
  });
};

export const useAddAdminMessageToTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; data: { message: string } }) =>
      addAdminMessageToTicket(params.id, params.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminSupportTicket', variables.id] });
    },
  });
};
