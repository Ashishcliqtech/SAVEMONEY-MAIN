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
  referralCode?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface OTPRequest {
  email: string;
  otp: string;
}

export const authApi = {
  // Initiates signup and sends OTP
  signup: (data: SignupRequest): Promise<{ msg: string }> =>
    apiClient.post('/auth/signup', data).then(res => res.data),

  // Verifies OTP and completes signup
  verifyOTP: (data: OTPRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/verify-otp', data).then(res => res.data),
    
  // Logs in a user
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data).then(res => res.data),

  // Fetches the current user's profile
  getProfile: (): Promise<User> =>
    apiClient.get('/user/profile').then(res => res.data),

  // Logs out the user (client-side only for this setup)
  logout: (): Promise<void> => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },

  forgotPassword: (email: string): Promise<{ msg: string }> =>
    apiClient.post('/auth/forgot-password', { email }).then(res => res.data),

  resetPassword: (token: string, password: string): Promise<{ msg: string }> =>
    apiClient.post('/auth/reset-password', { token, password }).then(res => res.data),
};