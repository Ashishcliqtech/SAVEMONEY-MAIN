import { useQuery } from '@tanstack/react-query';
import { search } from '../api';

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => search.search(query),
    enabled: !!query,
  });
}