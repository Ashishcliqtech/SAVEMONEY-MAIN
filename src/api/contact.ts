import { apiClient } from './client';
import {
  PaginatedContactInquiries,
  SubmitContactInquiryData,
  SubmitContactInquiryResponse,
  ContactInquiry,
  UpdateContactInquiryData
} from '../types/contact';

export const submitContactInquiry = (data: SubmitContactInquiryData): Promise<SubmitContactInquiryResponse> => {
  return apiClient.post('/contact', data);
};

export const getContactInquiries = (params: { page?: number; limit?: number; unread?: boolean }): Promise<PaginatedContactInquiries> => {
  return apiClient.get('/admin/contact-inquiries', { params });
};

export const updateContactInquiry = (id: string, data: UpdateContactInquiryData): Promise<ContactInquiry> => {
  return apiClient.patch(`/admin/contact-inquiries/${id}`, data);
};
