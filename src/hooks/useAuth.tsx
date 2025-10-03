import React, { useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import { User } from '../types';
import { authApi, SendOtpPayload, VerifyOtpPayload } from '../api/auth';
import { userApi } from '../api/user';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import { io, Socket } from 'socket.io-client';

interface AuthProviderProps {
  children: ReactNode;
}

const SOCKET_URL = 'https://updatedbackendcashkro.onrender.com';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const userData = await userApi.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session expired or token is invalid:", error);
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (user && !socket) {
      const token = localStorage.getItem('auth_token');
      const newSocket = io(SOCKET_URL, { auth: { token } });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket.io connected successfully.');
        newSocket.emit('join', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket.io disconnected.');
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, socket]);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      await loadUser(); 
      const userData = await userApi.getProfile(); 
      toast.success('Welcome back!');
      return userData;
    } catch (error) {
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
      await loadUser(); 
      const userData = await userApi.getProfile();
      toast.success('Account verified successfully!');
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const signup = async (signupData: SendOtpPayload) => {
    setIsLoading(true);
    try {
      await authApi.sendOtp(signupData);
      toast.success('OTP sent to your email!');
    } catch (error) {
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
      throw error;
    }
  };
  
  const resetPassword = async (password: string, token: string) => {
    try {
      await authApi.resetPassword({ password, token });
      toast.success('Password has been reset successfully!');
    } catch (error) {
      throw error;
    }
  }

  const loginWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const loginWithFacebook = async () => {
    toast.info('Facebook login is not yet implemented on the backend.');
  };
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    socket,
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