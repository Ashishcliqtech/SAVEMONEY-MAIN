import { apiClient } from './client';

// --- Interfaces for Data Consistency ---

// Simplified User object for population in Transaction model
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

// Interface for a single Admin Transaction (Cashback/Credit only)
export interface AdminTransaction {
  _id: string;
  user: PopulatedUser | string; // Should be PopulatedUser on fetch
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'confirmed' | 'failed';
  description: string;
  createdAt: string;
}

// Interface for the fetched list of pending transactions
export interface PendingTransactionsResponse {
  transactions: AdminTransaction[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Interface for manual credit payload (Admin)
export interface ManualCreditPayload {
  userId: string;
  amount: number;
  description: string;
}

// Interface for rejection payload (Admin)
export interface RejectPayload {
  id: string;
  reason: string;
}

// --- API Functions ---

/**
 * Fetches a paginated list of pending cashback transactions (status='pending', type='credit').
 * @param page The current page number.
 * @param limit The number of items per page.
 */
export async function getPendingTransactions(page: number, limit: number): Promise<PendingTransactionsResponse> {
  const { data } = await apiClient.get(`/admin/transactions/pending?page=${page}&limit=${limit}`);
  return data;
}

/**
 * Approves a pending transaction.
 * @param transactionId The ID of the transaction to approve.
 */
export async function approveTransaction(transactionId: string): Promise<AdminTransaction> {
  const { data } = await apiClient.post(`/admin/transactions/${transactionId}/approve`);
  return data;
}

/**
 * Rejects a pending transaction.
 * @param payload The transaction ID and rejection reason.
 */
export async function rejectTransaction(payload: RejectPayload): Promise<AdminTransaction> {
  const { id, reason } = payload;
  const { data } = await apiClient.post(`/admin/transactions/${id}/reject`, { rejectionReason: reason });
  return data;
}

/**
 * Manually credits confirmed cashback to a user's wallet.
 * @param payload The user ID, amount, and description for the manual credit.
 */
export async function manuallyAddCashback(payload: ManualCreditPayload): Promise<any> {
  const { data } = await apiClient.post(`/admin/wallet/add-cashback`, payload);
  return data;
}
