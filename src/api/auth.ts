import { apiClient } from './client';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface OTPRequest {
  phone: string;
  otp: string;
}

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data),

  signup: (data: SignupRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/signup', data),

  verifyOTP: (data: OTPRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/verify-otp', data),

  refreshToken: (refreshToken: string): Promise<AuthResponse> =>
    apiClient.post('/auth/refresh', { refreshToken }),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout'),

  forgotPassword: (email: string): Promise<void> =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string): Promise<void> =>
    apiClient.post('/auth/reset-password', { token, password }),

  socialLogin: (provider: string, token: string): Promise<AuthResponse> =>
    apiClient.post('/auth/social', { provider, token }),
};