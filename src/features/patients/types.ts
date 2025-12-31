import type { Patient, Visit, EmergencyContact, MinorChild } from '@/types';

export interface PatientWithRelations extends Patient {
  emergency_contact?: EmergencyContact | null;
  minor_children?: MinorChild[];
  age?: number;
  days_since_last_visit?: number | null;
}

export interface PatientWithVisits extends PatientWithRelations {
  visits?: Visit[];
  physicians?: any[];
  surgeries?: any[];
  chemo_cycles?: any[];
  radiation_treatments?: any[];
}
