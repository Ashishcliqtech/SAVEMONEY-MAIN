import { apiClient } from './client';
import { User } from '../types';

// Assuming these types are in `src/types`
export interface SendOtpPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    referralCode?: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export const authApi = {
  sendOtp: (payload: SendOtpPayload): Promise<{ msg: string }> =>
    apiClient.post('/auth/send-otp', payload).then(res => res.data),

  verifyOtp: (payload: VerifyOtpPayload): Promise<AuthResponse> =>
    apiClient.post('/auth/verify-otp', payload).then(res => res.data),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiClient.post('/auth/login', payload).then(res => res.data),

  forgotPassword: (payload: ForgotPasswordPayload): Promise<{ msg: string }> =>
    apiClient.post('/auth/forgot-password', payload).then(res => res.data),

  resetPassword: (payload: ResetPasswordPayload): Promise<{ msg: string }> =>
    apiClient.post('/auth/reset-password', payload).then(res => res.data),
};
