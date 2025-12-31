import { supabase } from '@/lib/supabase';

export interface AssistanceItem {
  id: string;
  visit_id: string;
  patient_id: string;
  assistance_type: string;
  item_name: string | null;
  quantity: number;
  unit: string | null;
  card_number: string | null;
  amount: number | null;
  category: string | null;
  description: string | null;
  notes: string | null;
  provided_by: string | null;
  provided_at: string;
  created_at: string;
  updated_at: string;
}

export interface AssistanceItemInput {
  assistance_type: string;
  item_name?: string;
  quantity?: number;
  unit?: string;
  card_number?: string;
  amount?: number;
  category?: string;
  description?: string;
  notes?: string;
}

export const assistanceItemService = {
  /**
   * Create multiple assistance items for a visit
   */
  async createAssistanceItems(
    visitId: string,
    patientId: string,
    items: AssistanceItemInput[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const itemsToInsert = items.map(item => ({
        visit_id: visitId,
        patient_id: patientId,
        assistance_type: item.assistance_type,
        item_name: item.item_name || null,
        quantity: item.quantity || 1,
        unit: item.unit || null,
        card_number: item.card_number || null,
        amount: item.amount || null,
        category: item.category || null,
        description: item.description || null,
        notes: item.notes || null,
        provided_by: user?.id || null,
      }));

      const { error } = await supabase
        .from('assistance_items')
        .insert(itemsToInsert);

      if (error) {
        console.error('❌ Error creating assistance items:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Created assistance items:', itemsToInsert.length);
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Get assistance items for a specific visit
   */
  async getAssistanceItemsForVisit(visitId: string): Promise<AssistanceItem[]> {
    try {
      const { data, error } = await supabase
        .from('assistance_items')
        .select('*')
        .eq('visit_id', visitId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching assistance items:', error);
        return [];
      }

      return data as AssistanceItem[];
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return [];
    }
  },

  /**
   * Get assistance items for a patient (all visits)
   */
  async getAssistanceItemsForPatient(
    patientId: string,
    limit: number = 50
  ): Promise<AssistanceItem[]> {
    try {
      const { data, error } = await supabase
        .from('assistance_items')
        .select('*')
        .eq('patient_id', patientId)
        .order('provided_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching assistance items:', error);
        return [];
      }

      return data as AssistanceItem[];
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return [];
    }
  },

  /**
   * Update an assistance item
   */
  async updateAssistanceItem(
    itemId: string,
    updates: Partial<AssistanceItemInput>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('assistance_items')
        .update(updates)
        .eq('id', itemId);

      if (error) {
        console.error('❌ Error updating assistance item:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Updated assistance item');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Delete an assistance item
   */
  async deleteAssistanceItem(itemId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('assistance_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('❌ Error deleting assistance item:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Deleted assistance item');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
};
