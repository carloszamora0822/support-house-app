/**
 * Mock visit data for testing
 * Covers visits for all 3 mock patients with various scenarios
 */

export const mockVisits = [
  // Patient 001 visits (Jane Doe - 12 visits)
  {
    id: 'visit-001',
    patient_id: 'patient-001',
    visit_type: 'intake',
    check_in_timestamp: new Date('2023-03-20T10:30:00'),
    check_out_timestamp: new Date('2023-03-20T11:45:00'),
    duration_minutes: 75,
    staff_user_id: 'staff-001',
    staff_name: 'Sarah Johnson',
    assistance_requested: ['wigs_salon', 'food', 'medical_supplies'],
    assistance_provided: ['wigs_salon', 'food', 'medical_supplies'],
    assistance_other: null,
    visit_notes: 'Initial intake completed. Patient very grateful for services.',
    created_at: new Date('2023-03-20T10:30:00'),
  },
  {
    id: 'visit-002',
    patient_id: 'patient-001',
    visit_type: 'returning',
    check_in_timestamp: new Date('2023-04-15T14:20:00'),
    check_out_timestamp: new Date('2023-04-15T14:50:00'),
    duration_minutes: 30,
    staff_user_id: 'staff-002',
    staff_name: 'Mike Davis',
    assistance_requested: ['food'],
    assistance_provided: ['food'],
    assistance_other: null,
    visit_notes: 'Quick visit for food assistance.',
    created_at: new Date('2023-04-15T14:20:00'),
  },
  {
    id: 'visit-003',
    patient_id: 'patient-001',
    visit_type: 'returning',
    check_in_timestamp: new Date('2024-12-15T10:30:00'),
    check_out_timestamp: new Date('2024-12-15T11:00:00'),
    duration_minutes: 30,
    staff_user_id: 'staff-001',
    staff_name: 'Sarah Johnson',
    assistance_requested: ['food', 'gas_card'],
    assistance_provided: ['food', 'gas_card'],
    assistance_other: null,
    visit_notes: 'Requested additional food assistance for holidays.',
    created_at: new Date('2024-12-15T10:30:00'),
  },
  
  // Patient 002 visits (John Smith - 1 visit)
  {
    id: 'visit-004',
    patient_id: 'patient-002',
    visit_type: 'intake',
    check_in_timestamp: new Date('2024-11-03T09:00:00'),
    check_out_timestamp: new Date('2024-11-03T10:30:00'),
    duration_minutes: 90,
    staff_user_id: 'staff-002',
    staff_name: 'Mike Davis',
    assistance_requested: ['food', 'liquid_nutrition', 'gas_card'],
    assistance_provided: ['food', 'liquid_nutrition', 'gas_card'],
    assistance_other: null,
    visit_notes: 'New patient intake. Recent diagnosis. Referred by sister.',
    created_at: new Date('2024-11-03T09:00:00'),
  },
  
  // Patient 003 visits (Emily Johnson - 5 visits)
  {
    id: 'visit-005',
    patient_id: 'patient-003',
    visit_type: 'intake',
    check_in_timestamp: new Date('2024-02-05T11:15:00'),
    check_out_timestamp: new Date('2024-02-05T12:30:00'),
    duration_minutes: 75,
    staff_user_id: 'staff-001',
    staff_name: 'Sarah Johnson',
    assistance_requested: ['food', 'clothing', 'support_group'],
    assistance_provided: ['food', 'clothing'],
    assistance_other: 'School supplies',
    visit_notes: 'Child patient with mother. Very sweet family.',
    created_at: new Date('2024-02-05T11:15:00'),
  },
  {
    id: 'visit-006',
    patient_id: 'patient-003',
    visit_type: 'returning',
    check_in_timestamp: new Date('2024-03-10T13:00:00'),
    check_out_timestamp: new Date('2024-03-10T13:30:00'),
    duration_minutes: 30,
    staff_user_id: 'staff-001',
    staff_name: 'Sarah Johnson',
    assistance_requested: ['food'],
    assistance_provided: ['food'],
    assistance_other: null,
    visit_notes: 'Mother mentioned treatment going well.',
    created_at: new Date('2024-03-10T13:00:00'),
  },
  {
    id: 'visit-007',
    patient_id: 'patient-003',
    visit_type: 'returning',
    check_in_timestamp: new Date('2024-12-20T10:00:00'),
    check_out_timestamp: null, // Still checked in
    duration_minutes: null,
    staff_user_id: 'staff-002',
    staff_name: 'Mike Davis',
    assistance_requested: ['food', 'clothing'],
    assistance_provided: null, // Not yet provided
    assistance_other: null,
    visit_notes: 'Holiday visit. Family doing well.',
    created_at: new Date('2024-12-20T10:00:00'),
  },
  
  // Additional visits for testing edge cases
  {
    id: 'visit-008',
    patient_id: 'patient-001',
    visit_type: 'returning',
    check_in_timestamp: new Date('2024-12-28T09:00:00'),
    check_out_timestamp: null, // Currently checked in
    duration_minutes: null,
    staff_user_id: 'staff-001',
    staff_name: 'Sarah Johnson',
    assistance_requested: ['wigs_salon'],
    assistance_provided: null,
    assistance_other: null,
    visit_notes: 'Wig fitting appointment.',
    created_at: new Date('2024-12-28T09:00:00'),
  },
];

export default mockVisits;
