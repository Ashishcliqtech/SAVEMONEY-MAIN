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
  sendOTP: (email: string, name?: string, data?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  completeSignupAfterOTP: (email: string, otp: string) => Promise<void>; // Expose for OTP flow in Signup page
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

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
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

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
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

      // 1. Send OTP and store signup data in Redis (handled by edge function)
      await sendOTP(data.email, data.name, data); // pass full signup data
      // 2. Wait for OTP verification in the UI (handled by verifyOTP)
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Call this after OTP is verified
  const completeSignupAfterOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      // 1. Verify OTP and get signup data from edge function
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp },
      });
      if (error || !data.success) {
        throw new Error(data.error || 'Failed to verify OTP. Please try again.');
      }
      const signupData = data.signupData?.data || {};
      // 2. Create Supabase Auth user and user profile
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: signupData.email.toLowerCase().trim(),
        password: signupData.password,
        options: {
          data: {
            name: signupData.name.trim(),
            phone: signupData.phone?.trim(),
            referral_code: signupData.referralCode?.trim(),
          }
        }
      });
      if (signupError) {
        throw new Error(signupError.message || 'Signup failed');
      }
      if (!authData.user) {
        throw new Error('Failed to create account. Please try again.');
      }
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: signupData.email.toLowerCase().trim(),
          name: signupData.name.trim(),
          phone: signupData.phone?.trim(),
          referred_by: signupData.referralCode ? await getUserByReferralCode(signupData.referralCode.trim()) : null,
        })
        .select()
        .single();
      if (userError) {
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile. Please try again.');
      }
      setUser(userData as User);
      toast.success('Account created successfully!');
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

      // Call the verify-otp Edge Function
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email: email.toLowerCase().trim(), otp },
      });

      if (error || !data.success) {
        throw new Error(data.error || 'Failed to verify OTP. Please try again.');
      }

      // Manually update the user's email_confirmed_at status
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: { ...user.user_metadata, email_confirmed_at: new Date().toISOString() }
        });
      }

      toast.success('Email verified successfully!');

    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (email: string, name?: string, data?: any) => {
    try {
      setIsLoading(true);

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const cleanEmail = email.toLowerCase().trim();

      // Call Supabase Edge Function to send OTP email
      const { data: responseData, error } = await supabase.functions.invoke('send-otp', {
        body: {
          to: cleanEmail,
          name: name || 'User',
          signupData: data, // pass full signup data
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
    completeSignupAfterOTP, // Expose for OTP flow in Signup page
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