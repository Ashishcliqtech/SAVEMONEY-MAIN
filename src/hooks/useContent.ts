import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '../api/content';
import { ContentSection } from '../types';
import toast from 'react-hot-toast';

export const useContentSections = () => {
  return useQuery<ContentSection[], Error>({
    queryKey: ['contentSections'],
    queryFn: contentApi.getContentSections,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFile }: { data: Partial<ContentSection>, imageFile?: File }) => 
      contentApi.createContentSection(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create content section');
    },
  });
};

export const useUpdateContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFile }: { id: string; data: Partial<ContentSection>, imageFile?: File }) =>
      contentApi.updateContentSection(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update content section');
    },
  });
};

export const useDeleteContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteContentSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete content section');
    },
  });
};
