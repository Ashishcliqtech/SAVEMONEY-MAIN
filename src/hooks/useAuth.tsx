import React, { useState, useEffect, ReactNode, useContext } from 'react';
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

  // Effect to handle initial user load and socket connection
  useEffect(() => {
    const loadUserAndConnectSocket = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await userApi.getProfile();
          setUser(userData);
          // Establish socket connection for the logged-in user
          const newSocket = io(SOCKET_URL, { auth: { token } });
          setSocket(newSocket);

          newSocket.on('connect', () => {
            console.log('Socket.io connected successfully.');
            newSocket.emit('join', userData.id); // Join room with user ID
          });

          newSocket.on('disconnect', () => {
            console.log('Socket.io disconnected.');
          });

        } catch (error) {
          console.error("Session expired or token is invalid:", error);
          localStorage.removeItem('auth_token');
          setUser(null);
          if (socket) {
            socket.disconnect();
            setSocket(null);
          }
        }
      }
      setIsLoading(false);
    };

    loadUserAndConnectSocket();
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectSocket = (token: string, userData: User) => {
    if (socket) {
      socket.disconnect();
    }
    
    const newSocket = io(SOCKET_URL, { auth: { token } });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.io connected successfully after login.');
      newSocket.emit('join', userData.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.io disconnected.');
    });
  };

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      const userData = await userApi.getProfile();
      setUser(userData);
      connectSocket(response.token, userData);
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
      const userData = await userApi.getProfile();
      setUser(userData);
      connectSocket(response.token, userData);
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
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  // ... other functions like signup, forgotPassword, etc. remain unchanged
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
    isAuthenticated: !!user,
    isLoading,
    socket, // Expose socket instance
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