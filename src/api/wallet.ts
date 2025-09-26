import { apiClient } from './client';
import { Transaction, WithdrawalRequest } from '../types';

export interface WalletData {
  totalCashback: number;
  availableCashback: number;
  pendingCashback: number;
  withdrawnCashback: number;
}

export interface WithdrawRequest {
  amount: number;
  method: 'upi' | 'bank' | 'paytm' | 'voucher';
  accountDetails: string;
}

export const walletApi = {
  getWalletData: (): Promise<WalletData> =>
    apiClient.get('/wallet'),

  getTransactions: (page?: number, limit?: number): Promise<{
    transactions: Transaction[];
    total: number;
  }> =>
    apiClient.get('/wallet/transactions', { params: { page, limit } }),

  withdraw: (data: WithdrawRequest): Promise<WithdrawalRequest> =>
    apiClient.post('/wallet/withdraw', data),

  getWithdrawals: (): Promise<WithdrawalRequest[]> =>
    apiClient.get('/wallet/withdrawals'),

  getWithdrawalMethods: (): Promise<Array<{
    id: string;
    name: string;
    minAmount: number;
    processingTime: string;
  }>> =>
    apiClient.get('/wallet/withdrawal-methods'),
};