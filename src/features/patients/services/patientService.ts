import { supabase } from '@/lib/supabase';
import type { Patient, Visit, EmergencyContact, MinorChild } from '@/types';
import type { PatientWithRelations, PatientWithVisits } from '../types';
import { calculateAge, calculateDaysSince } from '@/utils/dateUtils';

export const patientService = {
  async getPatient(patientId: string): Promise<PatientWithRelations> {
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (error || !patient) {
      console.error('Patient lookup error:', error?.message);
      throw new Error('Unable to load patient information. Please try again.');
    }

    // Fetch emergency contact
    const { data: emergencyContact } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('patient_id', patientId)
      .maybeSingle();

    // Fetch minor children
    const { data: minorChildren } = await supabase
      .from('minor_children')
      .select('*')
      .eq('patient_id', patientId);

    // Calculate age and days since last visit
    const age = patient.dob ? calculateAge(patient.dob) : undefined;
    const days_since_last_visit = calculateDaysSince(patient.last_visit_date);

    return {
      ...(patient as Patient),
      emergency_contact: emergencyContact as EmergencyContact | null,
      minor_children: (minorChildren as MinorChild[]) || [],
      age,
      days_since_last_visit,
    };
  },

  async getPatientWithVisits(
    patientId: string,
    limit: number = 10
  ): Promise<PatientWithVisits> {
    const patient = await this.getPatient(patientId);

    // Fetch visit history
    const { data: visits, error: visitsError } = await supabase
      .from('visits')
      .select('*')
      .eq('patient_id', patientId)
      .order('check_in_timestamp', { ascending: false })
      .limit(limit);

    if (visitsError) {
      console.error('Visit history error:', visitsError.message);
      throw new Error('Unable to load visit history. Please try again.');
    }

    return {
      ...patient,
      visits: (visits as Visit[]) || [],
    };
  },
};
