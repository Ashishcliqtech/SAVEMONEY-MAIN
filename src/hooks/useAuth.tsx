import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { User } from '../types';
import { authApi, SendOtpPayload, VerifyOtpPayload } from '../api/auth';
import { userApi } from '../api/user';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await userApi.getProfile();
          setUser(userData);
        } catch (error) {
          // The API client's error interceptor will handle the toast notification.
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      const userData = await userApi.getProfile();
      setUser(userData);
      toast.success('Welcome back!');
      return userData;
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData: SendOtpPayload) => {
    setIsLoading(true);
    try {
      await authApi.sendOtp(signupData);
      toast.success('OTP sent to your email!');
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (payload: VerifyOtpPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(payload);
      localStorage.setItem('auth_token', response.token);
      const userData = await userApi.getProfile();
      setUser(userData);
      toast.success('Account verified successfully!');
      return userData;
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword({ email });
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
      throw error;
    }
  };
  
  const resetPassword = async (password: string, token: string) => {
    try {
      await authApi.resetPassword({ password, token });
      toast.success('Password has been reset successfully!');
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
      throw error;
    }
  }

  const loginWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const loginWithFacebook = async () => {
    toast.info('Facebook login is not yet implemented on the backend.');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/';
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    verifyOtp,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};