import { supabase } from '@/lib/supabase';
import type { Visit } from '@/types';
import type { CheckInInput } from '../types';

export const visitService = {
  // Check in a patient and create a visit record
  async checkInPatient(input: CheckInInput): Promise<Visit> {
    // Get current staff user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new Error('Not authenticated');
    }

    // Get staff user details
    const { data: staffUser, error: staffError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (staffError || !staffUser) {
      console.error('Staff user lookup failed:', staffError?.message);
      throw new Error('Unable to verify staff credentials. Please log in again.');
    }

    // Check if patient already checked in today
    const alreadyCheckedIn = await this.isAlreadyCheckedInToday(input.patient_id);
    if (alreadyCheckedIn) {
      throw new Error('Patient has already checked in today');
    }

    // Check if this is the patient's first visit
    const { data: existingVisits } = await supabase
      .from('visits')
      .select('id')
      .eq('patient_id', input.patient_id)
      .limit(1)
      .maybeSingle();
    
    const isFirstVisit = !existingVisits;
    
    // Create visit record
    const visitData = {
      patient_id: input.patient_id,
      visit_type: isFirstVisit ? ('intake' as const) : ('returning' as const),
      check_in_timestamp: new Date().toISOString(),
      staff_user_id: staffUser.id,
      staff_name: staffUser.full_name,
      assistance_requested: input.assistance_requested,
      visit_notes: input.visit_notes || null,
    };

    const { data: visit, error: visitError } = await supabase
      .from('visits')
      .insert(visitData)
      .select()
      .single();

    if (visitError || !visit) {
      throw new Error(visitError?.message || 'Failed to create visit');
    }

    return visit as Visit;
  },

  // Check out a patient
  async checkOutPatient(visitId: string, notes?: string): Promise<Visit> {
    const checkOutTime = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('visits')
      .update({
        check_out_timestamp: checkOutTime,
        visit_notes: notes || null,
      })
      .eq('id', visitId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to check out patient');
    }

    return data as Visit;
  },

  // Get active visit for a patient (not checked out)
  async getActiveVisit(patientId: string): Promise<Visit | null> {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('patient_id', patientId)
      .is('check_out_timestamp', null)
      .order('check_in_timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active visit:', error.message);
      return null;
    }

    return data as Visit | null;
  },

  // Check if patient has already checked in today
  async isAlreadyCheckedInToday(patientId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('visits')
      .select('id, check_in_timestamp')
      .eq('patient_id', patientId)
      .gte('check_in_timestamp', today.toISOString())
      .maybeSingle();

    if (error) {
      return false;
    }

    return data !== null;
  },
};
