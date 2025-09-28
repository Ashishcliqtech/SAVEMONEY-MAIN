import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { User } from '../types';
import { authApi, SignupRequest } from '../api/auth';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle session management on app load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // If token exists, fetch user profile
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch profile, logging out.", error);
          // If token is invalid, clear it
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
      const userData = await authApi.getProfile();
      setUser(userData);
      toast.success('Welcome back!');
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData: SignupRequest) => {
    setIsLoading(true);
    try {
      await authApi.signup(signupData);
      toast.success('OTP sent to your email!');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOTP({ email, otp });
      localStorage.setItem('auth_token', response.token);
      const userData = await authApi.getProfile();
      setUser(userData);
      toast.success('Account verified successfully!');
      return userData;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const completeSignupAfterOTP = async (email: string, otp: string) => {
     await verifyOTP(email, otp);
  };

  const sendOTP = async (email: string) => {
    try {
      await authApi.sendOTP(email);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    // This would redirect to your backend's Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const loginWithFacebook = async () => {
    toast.info('Facebook login is not yet implemented on the backend.');
  };

  const logout = () => {
    authApi.logout();
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
    verifyOTP,
    completeSignupAfterOTP,
    sendOTP,
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