import { apiClient } from './client';
import { Offer } from '../types';

export interface OffersResponse {
  offers: Offer[];
  total: number;
  page: number;
  limit: number;
}

export interface OfferFilters {
  category?: string;
  storeId?: string;
  offerType?: 'cashback' | 'coupon' | 'deal';
  minCashback?: number;
  maxCashback?: number;
  search?: string;
  sortBy?: 'cashback' | 'expiry' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const offersApi = {
  getOffers: (filters?: OfferFilters): Promise<OffersResponse> =>
    apiClient.get('/offers', { params: filters }),

  getOffer: (id: string): Promise<Offer> =>
    apiClient.get(`/offers/${id}`),

  getTrendingOffers: (): Promise<Offer[]> =>
    apiClient.get('/offers/trending'),

  getFeaturedOffers: (): Promise<Offer[]> =>
    apiClient.get('/offers/featured'),

  getExclusiveOffers: (): Promise<Offer[]> =>
    apiClient.get('/offers/exclusive'),

  searchOffers: (query: string): Promise<Offer[]> =>
    apiClient.get('/offers/search', { params: { q: query } }),

  trackClick: (offerId: string): Promise<void> =>
    apiClient.post(`/offers/${offerId}/track`),
};