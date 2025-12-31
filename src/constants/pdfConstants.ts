// PDF Constants - Configurable text for disclosure form PDF
// Modify values here to change PDF content without touching template code

export const PDF_CONSTANTS = {
  // Header
  ORGANIZATION_NAME: 'Reynolds Cancer Support House',
  FORM_TITLE: 'Authorization to Disclose Medical Information',
  
  // Disclosure Text
  DISCLOSURE_PURPOSE: 'I authorize the release of relevant medical information to Reynolds Cancer Support House so they can coordinate services and resources to assist me during my cancer treatment.',
  
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
  FOOTER_TEXT: 'Reynolds Cancer Support House is a 501(c)(3) nonprofit organization providing support services to cancer patients in Northwest Arkansas.',
  CONTACT_INFO: 'Questions: (479) 555-0100 | info@supporthouse.org',
  FAX_NUMBER: '479.785.9065',
  RETURN_EMAIL: 'carla@reynoldscancersupporthouse.org',
  FAX_RETURN_TEXT: 'PLEASE RETURN FAX TO:',
  THANK_YOU_TEXT: 'Thank you for your assistance!',
  
  // Medical Information Labels
  DIAGNOSIS_LABEL: "Patient's Diagnosis",
  STAGE_LABEL: 'Stage',
  TREATMENT_PLAN_LABEL: 'Treatment Plan',
  EXPECTED_TREATMENTS_LABEL: 'Expected Number of Treatments',
  TREATMENT_START_LABEL: 'Treatment Start Date',
  TREATMENT_END_LABEL: 'Treatment End Date',
  MEDICAL_STAFF_ONLY: '**** TO BE COMPLETED BY MEDICAL OFFICE STAFF ONLY ****',
  
  // Chemotherapy Labels
  CHEMO_TITLE: 'Chemo Treatment:',
  CHEMO_TYPE_LABEL: 'Type',
  CHEMO_FREQUENCY_LABEL: 'Frequency:',
  
  // Radiation Labels
  RADIATION_TITLE: 'Radiation Treatment:',
  RADIATION_FREQUENCY_LABEL: 'Frequency:',
  
  // Status Labels
  STATUS_TITLE: 'Status:',
  STATUS_NOT_IN_TREATMENT: 'Not In Treatment',
  STATUS_PENDING: 'Treatment Pending',
  STATUS_TERMINAL: 'Terminal Prognosis',
  STATUS_ENDED: 'Treatment Ended',
  
  // Patient Consent
  PATIENT_CONSENT_TITLE: 'PATIENT CONSENT',
  CONSENT_BULLETS: [
    'I may revoke this authorization at any time by written request.',
    'My treatment will not be conditioned on signing this authorization.',
    'Information disclosed may be re-disclosed and no longer protected.',
    'This authorization expires one year from date signed or completion of services.',
  ],
  
  // Signature Labels
  PATIENT_SIG_LABEL: 'Patient or Representative Signature:',
  PRINTED_NAME_LABEL: 'Printed Name:',
  RELATIONSHIP_LABEL: 'Relationship:',
  STAFF_SIG_LABEL: 'Medical Office Staff Signature:',
  DIGITAL_SIG_METHOD: 'Signed electronically by',
  SIG_METHOD_DRAWN: 'Method: Drawn',
} as const;

export type PDFConstantsKey = keyof typeof PDF_CONSTANTS;
