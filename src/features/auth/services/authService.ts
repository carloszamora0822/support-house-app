import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import type { LoginCredentials } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Login failed');
    }

    console.log('Auth user ID:', data.user.id);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    console.log('User query result:', { userData, userError });

    if (userError) {
      throw new Error(userError?.message || 'Failed to fetch user data');
    }

    if (!userData) {
      throw new Error(`User record not found for ID: ${data.user.id}. Please contact an administrator.`);
    }

    return userData as User;
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (userError || !userData) {
      return null;
    }

    return userData as User;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session;
  },
};
