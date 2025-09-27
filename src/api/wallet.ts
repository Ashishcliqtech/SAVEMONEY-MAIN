import { apiClient } from './client';
import { Transaction, WithdrawalRequest } from '../types';

export interface WalletData {
  _id: string;
  user: string;
  totalCashback: number;
  availableCashback: number;
  pendingCashback: number;
}

export interface WithdrawRequest {
  amount: number;
  paymentDetails: {
    method: 'UPI' | 'Bank Transfer' | 'Paytm';
    upiId?: string;
    accountNumber?: string;
    ifsc?: string;
    paytmNumber?: string;
  };
}

export const walletApi = {
  getWalletData: (): Promise<WalletData> =>
    apiClient.get('/wallet').then(res => res.data),

  getTransactions: (page?: number, limit?: number): Promise<{
    transactions: Transaction[];
    totalPages: number;
    currentPage: number;
  }> =>
    apiClient.get('/wallet/transactions', { params: { page, limit } }).then(res => res.data),

  withdraw: (data: WithdrawRequest): Promise<{ msg: string }> =>
    apiClient.post('/wallet/withdraw', data).then(res => res.data),
};