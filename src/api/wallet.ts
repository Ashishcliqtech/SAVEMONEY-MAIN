import { apiClient } from './client';
import { Wallet, Transaction, Withdrawal } from '../types';


const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    return error.response.data.message || defaultMessage;
  } else if (error.request) {
    return 'No response from server. Please check your network connection.';
  } else {
    return error.message || defaultMessage;
  }
};

export interface RequestWithdrawalPayload {
  amount: number;
  method: string;
  accountDetails: string;
}

export const walletApi = {
  getWalletDetails: async (): Promise<Wallet> => {
    try {
      const response = await apiClient.get('/wallet');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch wallet details.'));
    }
  },

  getTransactionHistory: async (): Promise<Transaction[]> => {
    try {
      const response = await apiClient.get('/wallet/transactions');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction history.'));
    }
  },

  requestWithdrawal: async (payload: RequestWithdrawalPayload): Promise<{ msg: string }> => {
    try {
      const response = await apiClient.post('/wallet/withdraw', payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Withdrawal request failed.'));
    }
  },
};
