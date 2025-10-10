import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi, GetAllContentParams } from '../api/content';
import { ContentSection } from '../types';
import toast from 'react-hot-toast';

/**
 * Hook to fetch multiple content sections based on query parameters.
 * @param params - Parameters to filter the content, e.g., { page: 'homepage' }.
 */
export const useContentSections = (params: GetAllContentParams) => {
  return useQuery<ContentSection[], Error>({
    // Query key now includes parameters for unique caching
    queryKey: ['contentSections', params],
    queryFn: () => contentApi.getAllContent(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single content section by its slug.
 * @param slug - The unique slug of the content section.
 */
export const useContentBySlug = (slug: string) => {
  return useQuery<ContentSection, Error>({
    queryKey: ['content', slug],
    queryFn: () => contentApi.getContentBySlug(slug),
    enabled: !!slug, // Only run the query if a slug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useCreateContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => 
      contentApi.createContentSection(formData),
    onSuccess: () => {
      // Invalidate both list and specific content queries
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create content section');
    },
  });
};

export const useUpdateContentSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      contentApi.updateContentSection(id, formData),
    onSuccess: (data) => {
      // Invalidate list and the specific item by slug
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      queryClient.invalidateQueries({ queryKey: ['content', data.slug] });
      toast.success('Content section updated successfully!');
    },
    onError: (error: Error) => {
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
      // Consider invalidating specific slug queries if needed, though might be unnecessary after deletion
      toast.success('Content section deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete content section');
    },
  });
};
