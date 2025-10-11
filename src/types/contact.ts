export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SubmitContactInquiryData {
  name: string;
  email: string;
  message: string;
}

export interface SubmitContactInquiryResponse {
  message: string;
}

export interface PaginatedContactInquiries {
  inquiries: ContactInquiry[];
  totalPages: number;
  currentPage: number;
}

export interface UpdateContactInquiryData {
    is_read: boolean;
}
