// PDF Constants - Configurable text for disclosure form PDF
// Modify values here to change PDF content without touching template code

export const PDF_CONSTANTS = {
  // Header
  ORGANIZATION_NAME: 'Support House',
  FORM_TITLE: 'Authorization to Disclose Protected Health Information',
  
  // Disclosure Text
  DISCLOSURE_PURPOSE: 'I authorize Support House to obtain and disclose my protected health information for the purpose of coordinating cancer treatment support services.',
  
  DISCLOSURE_SCOPE: 'This authorization permits Support House to:',
  DISCLOSURE_ITEMS: [
    'Request medical records and treatment information from my healthcare providers',
    'Share relevant health information with partner organizations providing support services',
    'Coordinate assistance including wigs, medical supplies, nutritional support, and transportation',
    'Maintain records of services provided for grant reporting purposes',
  ],
  
  // Rights and Limitations
  RIGHTS_TITLE: 'Your Rights',
  RIGHTS_TEXT: 'You have the right to revoke this authorization at any time by submitting a written request to Support House. Revocation will not affect information already disclosed under this authorization.',
  
  EXPIRATION_TEXT: 'This authorization expires one year from the date signed below, or upon completion of services, whichever occurs first.',
  
  CONFIDENTIALITY_TEXT: 'Information disclosed under this authorization may be subject to re-disclosure by the recipient and may no longer be protected by federal privacy regulations.',
  
  // Signature Section
  SIGNATURE_INSTRUCTIONS: 'By signing below, I acknowledge that I have read and understand this authorization and agree to its terms.',
  PATIENT_SIGNATURE_LABEL: 'Patient Signature',
  REPRESENTATIVE_LABEL: 'Representative Signature (if applicable)',
  REPRESENTATIVE_RELATIONSHIP_LABEL: 'Relationship to Patient',
  DATE_LABEL: 'Date',
  
  // Office Use Section
  OFFICE_USE_TITLE: 'For Office Use Only',
  STAFF_SIGNATURE_LABEL: 'Staff Signature',
  RECEIVED_DATE_LABEL: 'Date Received',
  
  // Footer
  FOOTER_TEXT: 'Support House is a 501(c)(3) nonprofit organization providing support services to cancer patients in Northwest Arkansas.',
  CONTACT_INFO: 'For questions, contact Support House at (479) 555-0100 or info@supporthouse.org',
  
  // Medical Information Labels
  DIAGNOSIS_LABEL: 'Primary Diagnosis',
  STAGE_LABEL: 'Cancer Stage',
  TREATMENT_PLAN_LABEL: 'Treatment Plan',
  EXPECTED_TREATMENTS_LABEL: 'Expected Number of Treatments',
  TREATMENT_START_LABEL: 'Treatment Start Date',
  TREATMENT_END_LABEL: 'Expected Treatment End Date',
  
  // Chemotherapy Labels
  CHEMO_TITLE: 'Chemotherapy Details',
  CHEMO_TYPE_LABEL: 'Type',
  CHEMO_FREQUENCY_LABEL: 'Frequency',
  
  // Radiation Labels
  RADIATION_TITLE: 'Radiation Therapy Details',
  RADIATION_FREQUENCY_LABEL: 'Frequency',
  
  // Status Labels
  STATUS_TITLE: 'Treatment Status',
  STATUS_NOT_IN_TREATMENT: 'Not currently in treatment',
  STATUS_PENDING: 'Treatment pending',
  STATUS_TERMINAL: 'Terminal diagnosis',
  STATUS_ENDED: 'Treatment ended',
} as const;

export type PDFConstantsKey = keyof typeof PDF_CONSTANTS;
