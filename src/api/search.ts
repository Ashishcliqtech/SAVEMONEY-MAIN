import { apiClient } from './client';
import type { Category, Offer, Store } from '../types';

interface SearchResults {
  stores: Store[];
  categories: Category[];
  offers: Offer[];
}

export const search = {
  async search(query: string): Promise<SearchResults> {
    const response = await apiClient.get('/search', { params: { query } });
    return response.data;
  },
};