/**
 * Mock patient data for testing
 * 3 patients covering different scenarios:
 * 1. Active female patient with multiple visits
 * 2. Male patient with recent diagnosis
 * 3. Child patient with guardian
 */

export const mockPatients = [
  {
    // Patient 1: Active female patient with multiple visits
    id: 'patient-001',
    first_name: 'Jane',
    middle_name: 'Marie',
    last_name: 'Doe',
    goes_by: 'Janey',
    dob: new Date('1975-01-15'),
    
    // Contact
    email: 'jane.doe@email.com',
    phone_primary: '5551234567',
    phone_second: '5559876543',
    phone_other: null,
    
    // Address
    address: '123 Main Street',
    city: 'Fort Smith',
    county: 'Sebastian',
    state: 'AR',
    zip: '72901',
    
    // Demographics
    status: 'female',
    ethnicity: ['white'],
    ethnicity_other: null,
    language: ['english'],
    language_other: null,
    education: 'bachelors',
    
    // Guardian (not applicable)
    guardian_name: null,
    guardian_relationship: null,
    
    // Insurance & Veteran
    has_insurance: true,
    insurance_type: ['private', 'medicare'],
    is_veteran: false,
    
    // Employment
    employment_status: 'retired',
    employer_name: null,
    occupation: null,
    home_has_employed: true,
    
    // Marital & Caregiver
    marital_status: 'married',
    spouse_name: 'John Doe',
    spouse_cell: '5551112222',
    spouse_work: '5553334444',
    caregiver_name: null,
    caregiver_relation: null,
    caregiver_phone: null,
    
    // Medical
    diagnosis_primary: 'Breast Cancer',
    diagnosis_date: new Date('2023-03-15'),
    mets_to: 'Lymph nodes',
    
    oncologist_mercy: ['reddy', 'mackey'],
    oncologist_baptist: [],
    oncologist_other: null,
    
    rad_oncologist_mercy: 'Dr. Smith',
    rad_oncologist_baptist: null,
    rad_oncologist_other: null,
    
    provider_other_role: null,
    provider_other_location: null,
    provider_other_city: null,
    provider_other_state: null,
    
    surgeon_name: 'Dr. Johnson',
    surgeon_location: 'Mercy Hospital',
    surgeon_city: 'Fort Smith',
    surgeon_state: 'AR',
    
    general_doctor: 'Dr. Williams',
    general_location: 'Family Care Clinic',
    general_city: 'Fort Smith',
    general_state: 'AR',
    
    treatment_surgery_dates: '2023-04-10, 2023-05-15',
    treatment_chemo_start_1: new Date('2023-06-01'),
    treatment_chemo_end_1: new Date('2023-09-01'),
    treatment_chemo_start_2: null,
    treatment_chemo_end_2: null,
    treatment_radiation_start: new Date('2023-10-01'),
    treatment_radiation_end: new Date('2023-11-15'),
    treatment_other: null,
    
    // Visits & Tracking
    initial_visit_date: new Date('2023-03-20'),
    time_in: null,
    time_out: null,
    file_updated_date: new Date('2024-12-15'),
    
    // Referral
    referral_source: 'hospital_clinic_staff',
    referral_other: null,
    
    // Assistance
    assistance_types: ['wigs_salon', 'food', 'medical_supplies'],
    assistance_other: null,
    
    // Certification
    patient_signature: 'Jane M. Doe',
    patient_printed_name: 'Jane Marie Doe',
    patient_signature_date: new Date('2023-03-20'),
    interviewed_by: 'Sarah Johnson',
    interviewed_date: new Date('2023-03-20'),
    
    // Visit tracking
    last_visit_date: new Date('2024-12-15'),
    visit_count: 12,
    days_since_last_visit: 13,
    
    // Status
    patient_status: 'active',
    
    // Timestamps
    created_at: new Date('2023-03-20T10:30:00'),
    updated_at: new Date('2024-12-15T14:20:00'),
    created_by: 'staff-001',
  },
  
  {
    // Patient 2: Male patient with recent diagnosis, first visit
    id: 'patient-002',
    first_name: 'John',
    middle_name: 'Robert',
    last_name: 'Smith',
    goes_by: null,
    dob: new Date('1980-03-22'),
    
    // Contact
    email: 'john.smith@email.com',
    phone_primary: '5552223333',
    phone_second: null,
    phone_other: null,
    
    // Address
    address: '456 Oak Avenue',
    city: 'Rogers',
    county: 'Benton',
    state: 'AR',
    zip: '72756',
    
    // Demographics
    status: 'male',
    ethnicity: ['black', 'hispanic_latino'],
    ethnicity_other: null,
    language: ['english', 'spanish'],
    language_other: null,
    education: 'some_college',
    
    // Guardian (not applicable)
    guardian_name: null,
    guardian_relationship: null,
    
    // Insurance & Veteran
    has_insurance: true,
    insurance_type: ['medicaid'],
    is_veteran: true,
    
    // Employment
    employment_status: 'disabled',
    employer_name: null,
    occupation: null,
    home_has_employed: false,
    
    // Marital & Caregiver
    marital_status: 'single',
    spouse_name: null,
    spouse_cell: null,
    spouse_work: null,
    caregiver_name: 'Maria Garcia',
    caregiver_relation: 'sister',
    caregiver_phone: '5554445555',
    
    // Medical
    diagnosis_primary: 'Lung Cancer',
    diagnosis_date: new Date('2024-10-05'),
    mets_to: null,
    
    oncologist_mercy: [],
    oncologist_baptist: ['arzoumanian'],
    oncologist_other: null,
    
    rad_oncologist_mercy: null,
    rad_oncologist_baptist: 'Dr. Lee',
    rad_oncologist_other: null,
    
    provider_other_role: null,
    provider_other_location: null,
    provider_other_city: null,
    provider_other_state: null,
    
    surgeon_name: null,
    surgeon_location: null,
    surgeon_city: null,
    surgeon_state: null,
    
    general_doctor: 'Dr. Martinez',
    general_location: 'Community Health Center',
    general_city: 'Rogers',
    general_state: 'AR',
    
    treatment_surgery_dates: null,
    treatment_chemo_start_1: new Date('2024-11-01'),
    treatment_chemo_end_1: null,
    treatment_chemo_start_2: null,
    treatment_chemo_end_2: null,
    treatment_radiation_start: null,
    treatment_radiation_end: null,
    treatment_other: 'Immunotherapy',
    
    // Visits & Tracking
    initial_visit_date: new Date('2024-11-03'),
    time_in: null,
    time_out: null,
    file_updated_date: new Date('2024-11-03'),
    
    // Referral
    referral_source: 'friend_family',
    referral_other: null,
    
    // Assistance
    assistance_types: ['food', 'liquid_nutrition', 'gas_card'],
    assistance_other: null,
    
    // Certification
    patient_signature: 'John R. Smith',
    patient_printed_name: 'John Robert Smith',
    patient_signature_date: new Date('2024-11-03'),
    interviewed_by: 'Mike Davis',
    interviewed_date: new Date('2024-11-03'),
    
    // Visit tracking
    last_visit_date: new Date('2024-11-03'),
    visit_count: 1,
    days_since_last_visit: 55,
    
    // Status
    patient_status: 'active',
    
    // Timestamps
    created_at: new Date('2024-11-03T09:00:00'),
    updated_at: new Date('2024-11-03T09:00:00'),
    created_by: 'staff-002',
  },
  
  {
    // Patient 3: Child patient with guardian
    id: 'patient-003',
    first_name: 'Emily',
    middle_name: 'Grace',
    last_name: 'Johnson',
    goes_by: 'Em',
    dob: new Date('2015-06-10'),
    
    // Contact
    email: 'sarah.johnson@email.com',
    phone_primary: '5556667777',
    phone_second: '5558889999',
    phone_other: null,
    
    // Address
    address: '789 Pine Road',
    city: 'Bentonville',
    county: 'Benton',
    state: 'AR',
    zip: '72712',
    
    // Demographics
    status: 'child',
    ethnicity: ['white'],
    ethnicity_other: null,
    language: ['english'],
    language_other: null,
    education: null,
    
    // Guardian (child - required)
    guardian_name: 'Sarah Johnson',
    guardian_relationship: 'mother',
    
    // Insurance & Veteran
    has_insurance: true,
    insurance_type: ['private'],
    is_veteran: false,
    
    // Employment (not applicable for child)
    employment_status: null,
    employer_name: null,
    occupation: null,
    home_has_employed: true,
    
    // Marital & Caregiver (not applicable for child)
    marital_status: null,
    spouse_name: null,
    spouse_cell: null,
    spouse_work: null,
    caregiver_name: 'Sarah Johnson',
    caregiver_relation: 'mother',
    caregiver_phone: '5556667777',
    
    // Medical
    diagnosis_primary: 'Leukemia',
    diagnosis_date: new Date('2024-01-15'),
    mets_to: null,
    
    oncologist_mercy: ['shrestha'],
    oncologist_baptist: [],
    oncologist_other: null,
    
    rad_oncologist_mercy: null,
    rad_oncologist_baptist: null,
    rad_oncologist_other: null,
    
    provider_other_role: 'Pediatric Oncologist',
    provider_other_location: "Arkansas Children's Hospital",
    provider_other_city: 'Little Rock',
    provider_other_state: 'AR',
    
    surgeon_name: null,
    surgeon_location: null,
    surgeon_city: null,
    surgeon_state: null,
    
    general_doctor: 'Dr. Patel',
    general_location: 'Bentonville Pediatrics',
    general_city: 'Bentonville',
    general_state: 'AR',
    
    treatment_surgery_dates: null,
    treatment_chemo_start_1: new Date('2024-02-01'),
    treatment_chemo_end_1: new Date('2024-08-01'),
    treatment_chemo_start_2: null,
    treatment_chemo_end_2: null,
    treatment_radiation_start: null,
    treatment_radiation_end: null,
    treatment_other: null,
    
    // Visits & Tracking
    initial_visit_date: new Date('2024-02-05'),
    time_in: null,
    time_out: null,
    file_updated_date: new Date('2024-12-20'),
    
    // Referral
    referral_source: 'hospital_clinic_staff',
    referral_other: null,
    
    // Assistance
    assistance_types: ['food', 'clothing', 'support_group'],
    assistance_other: 'School supplies',
    
    // Certification (guardian signs for child)
    patient_signature: 'Sarah Johnson (guardian)',
    patient_printed_name: 'Emily Grace Johnson',
    patient_signature_date: new Date('2024-02-05'),
    interviewed_by: 'Sarah Johnson (staff)',
    interviewed_date: new Date('2024-02-05'),
    
    // Visit tracking
    last_visit_date: new Date('2024-12-20'),
    visit_count: 5,
    days_since_last_visit: 8,
    
    // Status
    patient_status: 'active',
    
    // Timestamps
    created_at: new Date('2024-02-05T11:15:00'),
    updated_at: new Date('2024-12-20T10:00:00'),
    created_by: 'staff-001',
  },
];

export default mockPatients;
