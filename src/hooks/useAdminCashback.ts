import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getPendingTransactions,
  approveTransaction,
  rejectTransaction,
  manuallyAddCashback,
  PendingTransactionsResponse,
  RejectPayload,
  ManualCreditPayload,
} from '../api/adminCashback';

// --- Shared Types ---

interface PaginationParams {
  page: number;
  limit: number;
}

interface PendingTransactionsQuery extends PaginationParams {}

// --- API Error Handling Utility ---
const handleApiError = (error: any, defaultMessage: string) => {
  const message = error.response?.data?.msg || error.response?.data?.message || defaultMessage;
  toast.error(message);
};

// ============================================================================
// ADMIN CASHBACK HOOKS
// ============================================================================

/**
 * Hook to fetch a paginated list of pending cashback transactions for admin review.
 * @param params {page, limit} Pagination parameters.
 */
export const usePendingTransactions = (params: PendingTransactionsQuery) => {
  const { page, limit } = params;
  return useQuery<PendingTransactionsResponse, Error>({
    queryKey: ['adminPendingTransactions', page, limit],
    queryFn: () => getPendingTransactions(page, limit),
    onError: (error) => handleApiError(error, 'Failed to fetch pending transactions.'),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to approve a pending cashback transaction.
 */
export const useApproveTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: (transactionId) => approveTransaction(transactionId),
    onSuccess: () => {
      toast.success('Cashback successfully approved and credited!');
      // Invalidate the pending list to remove the approved transaction
      queryClient.invalidateQueries({ queryKey: ['adminPendingTransactions'] });
      // Invalidate the user's wallet overview
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (error) => handleApiError(error, 'Failed to approve transaction.'),
  });
};

/**
 * Hook to reject a pending cashback transaction.
 */
export const useRejectTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, RejectPayload>({
    mutationFn: (payload) => rejectTransaction(payload),
    onSuccess: () => {
      toast.success('Transaction rejected successfully.');
      // Invalidate the pending list to remove the rejected transaction
      queryClient.invalidateQueries({ queryKey: ['adminPendingTransactions'] });
    },
    onError: (error) => handleApiError(error, 'Failed to reject transaction.'),
  });
};

/**
 * Hook to manually add confirmed cashback to a user's wallet.
 */
export const useManuallyAddCashback = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, ManualCreditPayload>({
    mutationFn: (payload) => manuallyAddCashback(payload),
    onSuccess: (data) => {
      // Assuming the API returns the transaction object which has the amount and user ID
      toast.success(`Successfully added ₹${data.transaction.amount} cashback to user ID ${data.transaction.user}`);
      // Invalidate the relevant caches
      queryClient.invalidateQueries({ queryKey: ['adminPendingTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => handleApiError(error, 'Failed to manually add cashback.'),
  });
};
