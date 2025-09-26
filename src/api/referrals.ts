import { apiClient } from './client';
import { ReferralData } from '../types';

export const referralsApi = {
  getReferralData: (): Promise<ReferralData> =>
    apiClient.get('/referrals'),

  generateReferralLink: (): Promise<{ link: string; code: string }> =>
    apiClient.post('/referrals/generate-link'),

  getReferralHistory: (): Promise<Array<{
    id: string;
    name: string;
    email: string;
    joinedDate: string;
    earnings: number;
    status: string;
  }>> =>
    apiClient.get('/referrals/history'),
};