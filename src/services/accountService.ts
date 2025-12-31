import { supabase } from '@/lib/supabase';

export const accountService = {
  /**
   * Permanently delete user account and all associated data
   * This action cannot be undone
   */
  async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Call Supabase RPC function to delete user and all related data
      // This will cascade delete all user's data (audit logs, etc.)
      const { error: deleteError } = await supabase.rpc('delete_user_account', {
        user_id_to_delete: user.id
      });

      if (deleteError) {
        console.error('Failed to delete account:', deleteError);
        return { success: false, error: deleteError.message };
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('Account deletion error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete account' 
      };
    }
  }
};
