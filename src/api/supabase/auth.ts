import { supabase } from '../../lib/supabase';
import { User } from '../../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  session: any;
}

export const authService = {
  // Sign up with email and password
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          referral_code: data.referralCode,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        // Do NOT set referral_code, let DB default handle it
        referred_by: data.referralCode ? await this.getUserByReferralCode(data.referralCode) || null : null,
      })
      .select()
      .single();

    if (userError) {
      console.error('User profile insert error:', userError);
      throw userError;
    }

    return {
      user: userData as User,
      session: authData.session,
    };
  },

  // Sign in with email and password
  async login(data: LoginRequest): Promise<AuthResponse> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Login failed');

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    return {
      user: userData as User,
      session: authData.session,
    };
  },

  // Sign out
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;
    return userData as User;
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  // Update password
  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  // Helper function to get user by referral code
  async getUserByReferralCode(referralCode: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (error) return null;
    return data?.id || null;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};