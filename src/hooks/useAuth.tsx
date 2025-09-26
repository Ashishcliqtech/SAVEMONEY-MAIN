import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            setUser(userData as User);
          } else {
            // User exists in auth but not in users table, sign them out
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            setUser(userData as User);
          } else {
            // User doesn't exist in users table
            await supabase.auth.signOut();
            setUser(null);
            toast.error('User profile not found. Please contact support.');
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          await supabase.auth.signOut();
          setUser(null);
          toast.error('Failed to load user profile. Please try again.');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      
      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please try again later.');
        } else if (error.message.includes('signup_disabled')) {
          throw new Error('New signups are currently disabled. Please contact support.');
        }
        throw new Error(error.message);
      }
      
      if (!data.user) {
        throw new Error('Login failed. Please try again.');
      }
      
      // Get user profile from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        if (userError.code === 'PGRST116') {
          // User doesn't exist in users table
          await supabase.auth.signOut();
          throw new Error('User profile not found. Please contact support.');
        }
        throw new Error('Failed to load user profile. Please try again.');
      }
      
      setUser(userData as User);
      toast.success('Welcome back!');
      
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!data.name || !data.email || !data.password) {
        throw new Error('All fields are required');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
      
      if (data.name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      
      if (data.phone && !/^\+?[\d\s-()]{10,}$/.test(data.phone)) {
        throw new Error('Please enter a valid phone number');
      }
      
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email.toLowerCase().trim())
        .single();
      
      if (existingUser) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: {
          data: {
            name: data.name.trim(),
            phone: data.phone?.trim(),
            referral_code: data.referralCode?.trim(),
          }
        }
      });
      
      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 8 characters long');
        } else if (error.message.includes('Unable to validate email address')) {
          throw new Error('Please enter a valid email address');
        } else if (error.message.includes('signup_disabled')) {
          throw new Error('New signups are currently disabled. Please contact support.');
        }
        throw new Error('Password must be at least 6 characters long');
      }
      
      if (!authData.user) {
        throw new Error('Failed to create account. Please try again.');
      }
      
      // Create user profile in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email.toLowerCase().trim(),
          name: data.name.trim(),
          phone: data.phone?.trim(),
          referred_by: data.referralCode ? await getUserByReferralCode(data.referralCode.trim()) : null,
        })
        .select()
        .single();
      
      if (userError) {
        // If user creation fails, clean up auth user
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile. Please try again.');
      }
      
      setUser(userData as User);
      
      // Send welcome email with OTP
      try {
        await sendOTP(data.email, data.name);
      } catch (emailError) {
        console.warn('Failed to send welcome email:', emailError);
        // Don't throw error here as account is already created
      }
      
      toast.success('Account created successfully! Please check your email for verification.');
      
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        if (error.message.includes('OAuth provider not enabled')) {
          throw new Error('Google login is not configured. Please contact support.');
        }
        throw new Error(error.message);
      }
      
      toast.success('Redirecting to Google...');
      
    } catch (error: any) {
      toast.error(error.message || 'Google login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: 'email',
        }
      });
      
      if (error) {
        if (error.message.includes('OAuth provider not enabled')) {
          throw new Error('Facebook login is not configured. Please contact support.');
        }
        throw new Error(error.message);
      }
      
      toast.success('Redirecting to Facebook...');
      
    } catch (error: any) {
      toast.error(error.message || 'Facebook login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      
      // Validate OTP format
      if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }
      
      if (!email) {
        throw new Error('Email is required for OTP verification');
      }
      
      const { error } = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token: otp,
        type: 'email'
      });
      
      if (error) {
        if (error.message.includes('Token has expired')) {
          throw new Error('OTP has expired. Please request a new one.');
        } else if (error.message.includes('Invalid token')) {
          throw new Error('Invalid OTP. Please check and try again.');
        } else if (error.message.includes('Email not found')) {
          throw new Error('Email not found. Please check your email address.');
        }
        throw new Error(error.message);
      }
      
      toast.success('Email verified successfully!');
      
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (email: string, name?: string) => {
    try {
      setIsLoading(true);
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      const cleanEmail = email.toLowerCase().trim();
      
      // Call Supabase Edge Function to send OTP email
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          to: cleanEmail,
          name: name || 'User',
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error('Failed to send OTP email. Please try again.');
      }
      
      toast.success('OTP sent to your email address');
      
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast.error(error.message || 'Failed to send OTP');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to get user by referral code
  const getUserByReferralCode = async (referralCode: string): Promise<string | null> => {
    if (!referralCode) return null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referralCode.toUpperCase().trim())
        .single();
      
      if (error || !data) return null;
      return data?.id || null;
    } catch (error) {
      return null;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        if (error.message.includes('Unable to validate email address')) {
          throw new Error('Please enter a valid email address');
        } else if (error.message.includes('Email rate limit exceeded')) {
          throw new Error('Too many password reset attempts. Please try again later.');
        }
        throw new Error(error.message);
      }
      
      toast.success('If an account with this email exists, you will receive a password reset link.');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        // Continue with logout even if Supabase fails
      }
      
      // Clear all auth-related data
      localStorage.clear();
      sessionStorage.clear();
      
      // Reset user state
      setUser(null);
      
      toast.success('Logged out successfully');
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    verifyOTP,
    sendOTP,
    resetPassword,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};