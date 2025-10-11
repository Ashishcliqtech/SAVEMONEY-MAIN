import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submitContactInquiry,
  getContactInquiries,
  updateContactInquiry,
} from '../api/contact';

export const useSubmitContactInquiry = () => {
  return useMutation({ mutationFn: submitContactInquiry });
};

export const useGetContactInquiries = (params: { page?: number; limit?: number; unread?: boolean }) => {
  return useQuery({ 
    queryKey: ['contactInquiries', params], 
    queryFn: () => getContactInquiries(params) 
  });
};

export const useUpdateContactInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; data: { is_read: boolean } }) => updateContactInquiry(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInquiries'] });
    },
  });
};
