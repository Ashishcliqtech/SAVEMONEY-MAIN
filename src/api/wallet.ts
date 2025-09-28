import { apiClient } from './client';
import { Wallet, Transaction, Withdrawal } from '../types';

// Assuming these types are in `src/types`
export interface RequestWithdrawalPayload {
    amount: number;
    paymentDetails: {
        method: string;
        [key: string]: any; 
    };
}

export interface TransactionPaginatedResponse {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
}

export const walletApi = {
  getWallet: (): Promise<Wallet> =>
    apiClient.get('/wallet').then(res => res.data),

  getTransactions: (page: number = 1, limit: number = 20): Promise<TransactionPaginatedResponse> =>
    apiClient.get('/wallet/transactions', { params: { page, limit } }).then(res => res.data),

  requestWithdrawal: (payload: RequestWithdrawalPayload): Promise<{ msg: string }> =>
    apiClient.post('/wallet/request-withdrawal', payload).then(res => res.data),

  getWithdrawals: (): Promise<Withdrawal[]> =>
    apiClient.get('/wallet/withdrawals').then(res => res.data),
};
