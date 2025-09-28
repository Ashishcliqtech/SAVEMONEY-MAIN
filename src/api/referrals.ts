import { apiClient } from './client';

export interface ReferralDashboardData {
    referralCode: string;
    earnings: number;
    referredUsersCount: number;
    referralLink: string;
}

export const referralApi = {
  getDashboard: (): Promise<ReferralDashboardData> =>
    apiClient.get('/referral/dashboard').then(res => res.data),
};
