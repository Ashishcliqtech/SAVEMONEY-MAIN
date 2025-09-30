import { apiClient } from './client';
import { Offer } from '../types';

// Assuming these types are in `src/types`
export interface GetAllOffersParams {
    page?: number;
    limit?: number;
    category?: string;
    store?: string;
}

export interface SearchOffersParams {
    q: string;
}

export interface OfferPaginatedResponse {
  offers: Offer[];
  totalPages: number;
  currentPage: number;
}

// Updated response type for trackOfferClick
export interface TrackClickResponse {
    redirectUrl: string;
}

export const offersApi = {
  // Public
  getAllOffers: (params: GetAllOffersParams): Promise<OfferPaginatedResponse> =>
    apiClient.get('/offers', { params }).then(res => res.data),

  getTrendingOffers: (): Promise<Offer[]> =>
    apiClient.get('/offers/trending').then(res => res.data),

  getFeaturedOffers: (): Promise<Offer[]> =>
    apiClient.get('/offers/featured').then(res => res.data),

  getExclusiveOffers: (): Promise<Offer[]> =>
    apiClient.get('/offers/exclusive').then(res => res.data),

  searchOffers: (params: SearchOffersParams): Promise<Offer[]> =>
    apiClient.get('/offers/search', { params }).then(res => res.data),

  getOfferById: (id: string): Promise<Offer> =>
    apiClient.get(`/offers/${id}`).then(res => res.data),

  trackOfferClick: (id: string): Promise<TrackClickResponse> =>
    apiClient.post(`/offers/${id}/track`, {}).then(res => res.data),

  // Admin
  createOffer: (formData: FormData): Promise<Offer> => {
    return apiClient.post('/admin/offers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },

  updateOffer: (id: string, formData: FormData): Promise<Offer> => {
    return apiClient.put(`/admin/offers/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
  
  deleteOffer: (id: string): Promise<void> =>
    apiClient.delete(`/admin/offers/${id}`).then(res => res.data),
};
