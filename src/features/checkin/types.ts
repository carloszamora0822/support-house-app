import type { Visit } from '@/types';

export interface CheckInInput {
  patient_id: string;
  assistance_requested: string[];
  visit_notes?: string;
}

export interface CheckInData extends CheckInInput {
  staff_user_id: string;
  staff_name: string;
  check_in_timestamp: Date;
  visit_type: 'returning';
}

export interface CheckInResult extends Visit {
  success: boolean;
}
