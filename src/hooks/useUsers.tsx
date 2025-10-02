import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { User } from '../types';

export const useAllUsers = () => {
  const { data: users, ...queryInfo } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/admin/users').then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    users,
    ...queryInfo,
  };
};
