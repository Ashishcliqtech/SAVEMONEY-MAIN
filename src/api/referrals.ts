import { apiClient } from './client';

export interface Referral {
    referredUserName: string;
    status: 'COMPLETED' | 'PENDING';
    rewardAmount: number;
    date: string;
}

export interface ReferralDashboardData {
    referralCode: string;
    earnings: number;
    referredUsersCount: number;
    referralLink: string;
}

export interface ReferralHistoryResponse {
    referrals: Referral[];
}

export const referralApi = {
  getDashboard: (): Promise<ReferralDashboardData> =>
    apiClient.get('/referral/dashboard').then(res => res.data),
  getHistory: (): Promise<ReferralHistoryResponse> => 
    apiClient.get('/referral/history').then(res => res.data),
};
