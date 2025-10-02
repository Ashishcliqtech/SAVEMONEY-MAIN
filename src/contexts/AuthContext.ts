import { createContext } from 'react';
import { User } from '../types';
import { SendOtpPayload, VerifyOtpPayload } from '../api/auth';
import { Socket } from 'socket.io-client';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  socket: Socket | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (signupData: SendOtpPayload) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<User>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
