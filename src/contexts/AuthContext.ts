import { createContext } from 'react';
import { User } from '../types';
import { SignupRequest } from '../api/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupRequest) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<User>;
  completeSignupAfterOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
