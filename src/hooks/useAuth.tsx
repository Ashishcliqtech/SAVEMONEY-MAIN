import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { authApi, LoginRequest, SignupRequest } from '../api/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  // Add other functions like loginWithGoogle if you implement them in the backend
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch profile, logging out.", error);
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (loginData: LoginRequest) => {
    setIsLoading(true);
    try {
      const { token } = await authApi.login(loginData);
      localStorage.setItem('auth_token', token);
      const userData = await authApi.getProfile();
      setUser(userData);
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to be caught in the component
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

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const { token } = await authApi.verifyOTP({ email, otp });
      localStorage.setItem('auth_token', token);
      const userData = await authApi.getProfile();
      setUser(userData);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    toast.success('Logged out successfully');
    // Redirect to home page
    window.location.href = '/';
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    verifyOTP,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : null /* Or a loading spinner */}
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
