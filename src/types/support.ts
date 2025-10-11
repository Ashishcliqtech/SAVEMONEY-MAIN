export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

export interface Message {
  _id: string;
  user: UserInfo;
  message: string;
  created_at: string;
}

export interface SupportTicket {
  _id: string;
  user: string;
  subject: string;
  status: 'OPEN' | 'CLOSED';
  created_at: string;
  updated_at: string;
}

export interface SupportTicketWithMessages extends SupportTicket {
  messages: Message[];
}

export interface AdminMessage extends Message {}

export interface AdminSupportTicketWithMessages {
  _id: string;
  user: UserInfo;
  subject: string;
  status: 'OPEN' | 'CLOSED';
  messages: AdminMessage[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedAdminSupportTickets {
  tickets: AdminSupportTicketWithMessages[];
  page: number;
  limit: number;
  total_tickets: number;
  open_tickets: number;
  closed_tickets: number;
  total_pages: number;
}
