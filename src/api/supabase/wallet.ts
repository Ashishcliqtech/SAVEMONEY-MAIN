import { supabase } from '../../lib/supabase';
import { Transaction, WithdrawalRequest } from '../../types';

export interface WithdrawRequest {
  amount: number;
  method: 'upi' | 'bank' | 'paytm' | 'voucher';
  accountDetails: Record<string, any>;
}

export const walletService = {
  // Get wallet data
  async getWalletData(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('total_cashback, available_cashback, pending_cashback')
      .eq('id', userId)
      .single();

    if (error) {
      // Handle the case where user doesn't exist (PGRST116)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return {
      totalCashback: data.total_cashback,
      availableCashback: data.available_cashback,
      pendingCashback: data.pending_cashback,
      withdrawnCashback: data.total_cashback - data.available_cashback - data.pending_cashback,
    };
  },

  // Get transactions
  async getTransactions(userId: string, page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('transactions')
      .select(`
        *,
        store:stores(*),
        offer:offers(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      transactions: data as Transaction[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  // Create withdrawal request
  async createWithdrawal(userId: string, withdrawData: WithdrawRequest): Promise<WithdrawalRequest> {
    const { data, error } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userId,
        amount: withdrawData.amount,
        method: withdrawData.method,
        account_details: withdrawData.accountDetails,
      })
      .select()
      .single();

    if (error) throw error;
    return data as WithdrawalRequest;
  },

  // Get withdrawal history
  async getWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as WithdrawalRequest[];
  },

  // Get all withdrawals (admin only)
  async getAllWithdrawals(filters: any = {}) {
    let query = supabase
      .from('withdrawals')
      .select(`
        *,
        user:users(name, email)
      `);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.method) {
      query = query.eq('method', filters.method);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Update withdrawal status (admin only)
  async updateWithdrawalStatus(
    id: string, 
    status: 'pending' | 'processing' | 'completed' | 'failed',
    adminNotes?: string,
    transactionId?: string
  ): Promise<void> {
    const updates: any = { 
      status,
      updated_at: new Date().toISOString(),
    };

    if (adminNotes) updates.admin_notes = adminNotes;
    if (transactionId) updates.transaction_id = transactionId;
    if (status === 'completed') updates.processed_at = new Date().toISOString();

    const { error } = await supabase
      .from('withdrawals')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },
};