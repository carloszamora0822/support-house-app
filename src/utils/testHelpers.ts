// Test helper functions for development
// Use in browser console: window.fillMockData()

export const mockPatientData = {
  first_name: 'Poop',
  middle_name: 'Robert',
  last_name: 'Thompson',
  goes_by: 'Mike',
  dob: '1968-07-22',
  email: 'mike.thompson@example.com',
  phone_primary: '479-555-1234',
  phone_second: '479-555-5678',
  phone_other: '',
  address: '789 Elm Street',
  city: 'Bentonville',
  county: 'Benton',
  state: 'AR',
  zip: '72712',
  status: 'male',
  ethnicity: ['white'],
  ethnicity_other: '',
  language: ['english'],
  language_other: '',
  education: 'high_school',
  guardian_name: '',
  guardian_relationship: '',
  has_insurance: true,
  insurance_type: ['medicaid'],
  is_veteran: true,
  employment_status: 'disabled',
  employer_name: '',
  occupation: '',
  home_has_employed: false,
  marital_status: 'divorced',
  spouse_name: '',
  spouse_cell: '',
  spouse_work: '',
  caregiver_name: 'Linda Thompson',
  caregiver_relation: 'sibling',
  caregiver_phone: '479-555-9999',
  minor_children: [],
  emergency_contact: {
    name: 'Linda Thompson',
    relationship: 'sibling',
    address: '321 Pine Road',
    city: 'Bentonville',
    state: 'AR',
    zip: '72712',
    phone: '479-555-9999',
  },
  referral_source: 'friend_family',
  referral_other: '',
  assistance_types: ['transportation', 'financial', 'lodging'],
  assistance_other: '',
  patient_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  patient_printed_name: 'Michael Robert Thompson',
  patient_signature_date: new Date().toISOString().split('T')[0],
  interviewed_by: 'Chele Martinez',
  interviewed_date: new Date().toISOString().split('T')[0],
};

export const mockMedicalData = {
  diagnosis_primary: 'Lung Cancer',
  diagnosis_date: '2024-09-10',
  mets_to: '',
  
  // Physicians - new structure
  mercy_oncologists: [],
  mercy_radiation: [],
  baptist_oncologists: [
    {
      name: 'Dr. Arzoumanian',
      location: 'Baptist - Oncology',
      phone: '4797097437',
      fax: '4797097190',
    },
  ],
  baptist_radiation: [
    {
      name: 'Dr. Schroyer',
      location: 'Baptist - Radiation',
      phone: '479709',
      fax: '4797097190',
    },
  ],
  custom_physicians: [
    {
      name: 'Dr. Johnson',
      location: 'Baptist Oncology',
      phone: '',
      fax: '',
    },
  ],
  
  // Treatment History - new dynamic arrays
  surgeries: [
    {
      date: '2024-10-05',
      notes: 'Lobectomy - right upper lobe removed',
    },
    {
      date: '2024-10-20',
      notes: 'Follow-up procedure for drainage',
    },
  ],
  chemo_cycles: [
    {
      start_date: '2024-11-01',
      end_date: '2024-12-15',
      notes: 'Cisplatin and Etoposide, 6 cycles',
    },
  ],
  radiation_treatments: [
    {
      start_date: '2024-12-20',
      end_date: '2025-01-31',
      notes: 'Radiation to chest area',
    },
  ],
  treatment_other: 'Immunotherapy scheduled for January 2025',
};

export const mockDisclosureData = {
  fax_form_date: new Date().toISOString().split('T')[0],
  fax_to_office: 'Baptist Health Medical Office',
  fax_patient_name: 'Michael Robert Thompson',
  fax_patient_dob: '1968-07-22',
  fax_patient_address: '789 Elm Street',
  fax_patient_city: 'Bentonville',
  fax_patient_state: 'AR',
  fax_patient_zip: '72712',
  fax_patient_phone: '479-555-1234',
  office_patient_diagnosis: 'Lung Cancer',
  office_stage: 'Stage IIIA',
  office_expected_treatments: 18,
  office_treatment_start_date: '2024-11-01',
  office_treatment_end_date: '2025-03-15',
  office_chemo_type: ['iv', 'oral'],
  office_chemo_frequency: 'bi_weekly',
  office_chemo_every_weeks: 2,
  office_radiation_frequency: 'daily',
  office_radiation_every_weeks: 0,
  office_status_flags: [],
  office_staff_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  office_staff_signature_date: new Date().toISOString().split('T')[0],
  fax_patient_signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  fax_patient_signature_date: new Date().toISOString().split('T')[0],
  fax_patient_printed_name: 'Michael Robert Thompson',
  fax_rep_relationship: '',
};

// Function to fill form data - expose to window for console access
export function fillMockData() {
  console.log('🔧 Filling form with mock data...');
  
  // Dispatch custom event with mock data
  const event = new CustomEvent('fillMockData', {
    detail: {
      patientData: mockPatientData,
      medicalData: mockMedicalData,
      disclosureData: mockDisclosureData,
    }
  });
  
  window.dispatchEvent(event);
  console.log('✅ Mock data filled! You can now navigate through the form.');
}

// Extend Window interface for test helpers
declare global {
  interface Window {
    fillMockData: () => void;
    mockData: {
      patient: typeof mockPatientData;
      medical: typeof mockMedicalData;
      disclosure: typeof mockDisclosureData;
    };
  }
}

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.fillMockData = fillMockData;
  window.mockData = {
    patient: mockPatientData,
    medical: mockMedicalData,
    disclosure: mockDisclosureData,
  };
  console.log('🧪 Test helpers loaded! Use window.fillMockData() to auto-populate the form');
}
