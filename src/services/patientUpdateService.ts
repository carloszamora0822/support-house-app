import { supabase } from '@/lib/supabase';

export const patientUpdateService = {
  /**
   * Update personal information section
   */
  async updatePersonalInfo(
    patientId: string,
    data: {
      first_name?: string;
      middle_name?: string | null;
      last_name?: string;
      goes_by?: string | null;
      dob?: string;
      status?: string | null;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', patientId);

      if (error) {
        console.error('❌ Error updating personal info:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Personal info updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Update contact information section
   */
  async updateContactInfo(
    patientId: string,
    data: {
      email?: string | null;
      phone_primary?: string | null;
      phone_second?: string | null;
      phone_other?: string | null;
      address?: string | null;
      city?: string | null;
      county?: string | null;
      state?: string | null;
      zip?: string | null;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', patientId);

      if (error) {
        console.error('❌ Error updating contact info:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Contact info updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Update medical information section
   */
  async updateMedicalInfo(
    patientId: string,
    data: {
      diagnosis_primary?: string | null;
      diagnosis_date?: string | null;
      mets_to?: string | null;
      treatment_other?: string | null;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', patientId);

      if (error) {
        console.error('❌ Error updating medical info:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Medical info updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Update insurance and benefits section
   */
  async updateInsuranceInfo(
    patientId: string,
    data: {
      has_insurance?: boolean | null;
      insurance_type?: string[] | null;
      is_veteran?: boolean | null;
      employment_status?: string | null;
      employer_name?: string | null;
      occupation?: string | null;
      marital_status?: string | null;
      spouse_name?: string | null;
      spouse_cell?: string | null;
      spouse_work?: string | null;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', patientId);

      if (error) {
        console.error('❌ Error updating insurance info:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Insurance info updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Update emergency contact and caregiver section
   */
  async updateEmergencyContact(
    patientId: string,
    data: {
      caregiver_name?: string | null;
      caregiver_relation?: string | null;
      caregiver_phone?: string | null;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', patientId);

      if (error) {
        console.error('❌ Error updating emergency contact:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Emergency contact updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Update demographics section
   */
  async updateDemographics(
    patientId: string,
    data: {
      ethnicity?: string[];
      ethnicity_other?: string;
      language?: string[];
      language_other?: string;
      education?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', patientId);

      if (error) {
        console.error('❌ Error updating demographics:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Demographics updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Update additional personal data (minor children, referral, guardian, certification)
   */
  async updateAdditionalPersonalData(
    patientId: string,
    data: {
      guardian_name?: string | null;
      guardian_relationship?: string | null;
      referral_source?: string | null;
      referral_name?: string | null;
      patient_signature?: string | null;
      patient_printed_name?: string | null;
      patient_signature_date?: string | null;
      interviewed_by?: string | null;
      interviewed_date?: string | null;
      emergency_contact?: any;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Extract emergency_contact from data - it's a separate table
      const { emergency_contact, ...patientData } = data;

      // Update patients table (without emergency_contact)
      const { error: patientError } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', patientId);

      if (patientError) {
        console.error('❌ Error updating additional personal data:', patientError);
        return { success: false, error: patientError.message };
      }

      // Update emergency_contacts table if data provided
      if (emergency_contact) {
        // Check if emergency contact exists
        const { data: existing } = await supabase
          .from('emergency_contacts')
          .select('id')
          .eq('patient_id', patientId)
          .maybeSingle();

        if (existing) {
          // Update existing
          const { error: emergencyError } = await supabase
            .from('emergency_contacts')
            .update(emergency_contact)
            .eq('patient_id', patientId);

          if (emergencyError) {
            console.error('❌ Error updating emergency contact:', emergencyError);
            return { success: false, error: emergencyError.message };
          }
        } else {
          // Insert new
          const { error: emergencyError } = await supabase
            .from('emergency_contacts')
            .insert({ ...emergency_contact, patient_id: patientId });

          if (emergencyError) {
            console.error('❌ Error creating emergency contact:', emergencyError);
            return { success: false, error: emergencyError.message };
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Error updating additional personal data:', error);
      return { success: false, error: 'Failed to update additional personal data' };
    }
  },
};
