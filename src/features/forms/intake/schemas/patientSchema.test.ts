import { describe, it, expect } from 'vitest';
import { patientInformationSchema } from './patientSchema';

describe('patientInformationSchema', () => {
  const validData = {
    // Identity
    first_name: 'John',
    last_name: 'Doe',
    dob: '1980-01-15',
    
    // Contact
    phone_primary: '555-123-4567',
    
    // Address
    address: '123 Main St',
    city: 'Fort Smith',
    county: 'Sebastian',
    state: 'AR',
    zip: '72901',
    
    // Demographics
    status: 'male' as const,
    ethnicity: ['white'],
    language: ['english'],
    
    // Insurance
    has_insurance: true,
    insurance_type: ['medicaid'],
    is_veteran: false,
    
    // Minor children
    minor_children: [],
    
    // Emergency contact
    emergency_contact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      address: '123 Main St',
      city: 'Fort Smith',
      state: 'AR',
      zip: '72901',
      phone: '555-987-6543',
    },
    
    // Referral
    referral_source: 'doctor',
    
    // Assistance
    assistance_types: ['food'],
    
    // Certification
    patient_signature: 'John Doe',
    patient_printed_name: 'John Doe',
    patient_signature_date: '2024-12-29',
    interviewed_by: 'Staff Member',
    interviewed_date: '2024-12-29',
  };

  describe('Required Fields', () => {
    it('validates with all required fields', () => {
      const result = patientInformationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('requires first_name', () => {
      const data = { ...validData, first_name: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('first_name');
      }
    });

    it('requires last_name', () => {
      const data = { ...validData, last_name: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('last_name');
      }
    });

    it('requires dob', () => {
      const data = { ...validData, dob: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires phone_primary', () => {
      const data = { ...validData, phone_primary: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires address', () => {
      const data = { ...validData, address: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires city', () => {
      const data = { ...validData, city: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires state', () => {
      const data = { ...validData, state: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires zip', () => {
      const data = { ...validData, zip: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires status', () => {
      const data = { ...validData, status: undefined };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires emergency_contact', () => {
      const data = { ...validData, emergency_contact: undefined };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires referral_source', () => {
      const data = { ...validData, referral_source: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires patient_signature', () => {
      const data = { ...validData, patient_signature: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('accepts valid email', () => {
      const data = { ...validData, email: 'john@example.com' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const data = { ...validData, email: 'not-an-email' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('allows empty email (optional)', () => {
      const data = { ...validData, email: '' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Phone Validation', () => {
    it('accepts various phone formats', () => {
      const formats = [
        '555-123-4567',
        '(555) 123-4567',
        '5551234567',
        '555.123.4567',
      ];

      formats.forEach(phone => {
        const data = { ...validData, phone_primary: phone };
        const result = patientInformationSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid phone format', () => {
      const data = { ...validData, phone_primary: '123' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('ZIP Code Validation', () => {
    it('accepts 5-digit ZIP', () => {
      const data = { ...validData, zip: '72901' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts ZIP+4 format', () => {
      const data = { ...validData, zip: '72901-1234' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid ZIP', () => {
      const data = { ...validData, zip: '123' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('DOB Validation', () => {
    it('accepts valid date', () => {
      const data = { ...validData, dob: '1980-01-15' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = { ...validData, dob: futureDate.toISOString().split('T')[0] };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects invalid date format', () => {
      const data = { ...validData, dob: 'not-a-date' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Status Validation', () => {
    it('accepts female', () => {
      const data = { ...validData, status: 'female' as const };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts male', () => {
      const data = { ...validData, status: 'male' as const };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts child', () => {
      const data = { 
        ...validData, 
        status: 'child' as const,
        guardian_name: 'Parent Name',
        guardian_relationship: 'Parent',
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const data = { ...validData, status: 'invalid' as any };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Conditional Validation - Guardian', () => {
    it('requires guardian_name when status is child', () => {
      const data = { 
        ...validData, 
        status: 'child' as const,
        guardian_name: '',
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires guardian_relationship when status is child', () => {
      const data = { 
        ...validData, 
        status: 'child' as const,
        guardian_name: 'Parent Name',
        guardian_relationship: '',
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('does not require guardian when status is not child', () => {
      const data = { 
        ...validData, 
        status: 'male' as const,
        guardian_name: undefined,
        guardian_relationship: undefined,
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Conditional Validation - Spouse', () => {
    it('requires spouse_name when marital_status is married', () => {
      const data = { 
        ...validData, 
        marital_status: 'married',
        spouse_name: '',
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('does not require spouse when not married', () => {
      const data = { 
        ...validData, 
        marital_status: 'single',
        spouse_name: undefined,
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Arrays Validation', () => {
    it('accepts ethnicity array', () => {
      const data = { ...validData, ethnicity: ['white', 'hispanic'] };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts language array', () => {
      const data = { ...validData, language: ['english', 'spanish'] };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts insurance_type array', () => {
      const data = { ...validData, insurance_type: ['medicaid', 'medicare'] };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts assistance_types array', () => {
      const data = { ...validData, assistance_types: ['food', 'transportation'] };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Minor Children Validation', () => {
    it('accepts empty minor_children array', () => {
      const data = { ...validData, minor_children: [] };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts valid minor child', () => {
      const data = { 
        ...validData, 
        minor_children: [
          { dob: '2015-05-10', sex: 'M' as const, name: 'Child Name' }
        ]
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('requires dob for minor child', () => {
      const data = { 
        ...validData, 
        minor_children: [
          { dob: '', sex: 'M' as const }
        ]
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires sex for minor child', () => {
      const data = { 
        ...validData, 
        minor_children: [
          { dob: '2015-05-10', sex: '' as any }
        ]
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('accepts multiple minor children', () => {
      const data = { 
        ...validData, 
        minor_children: [
          { dob: '2015-05-10', sex: 'M' as const },
          { dob: '2018-03-22', sex: 'F' as const },
        ]
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Emergency Contact Validation', () => {
    it('requires all emergency contact fields', () => {
      const requiredFields = ['name', 'relationship', 'address', 'city', 'state', 'zip', 'phone'];
      
      requiredFields.forEach(field => {
        const data = { 
          ...validData, 
          emergency_contact: {
            ...validData.emergency_contact,
            [field]: '',
          }
        };
        const result = patientInformationSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    it('validates emergency contact phone format', () => {
      const data = { 
        ...validData, 
        emergency_contact: {
          ...validData.emergency_contact,
          phone: '123',
        }
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('validates emergency contact ZIP format', () => {
      const data = { 
        ...validData, 
        emergency_contact: {
          ...validData.emergency_contact,
          zip: '123',
        }
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Optional Fields', () => {
    it('allows optional middle_name', () => {
      const data = { ...validData, middle_name: 'Michael' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('allows optional goes_by', () => {
      const data = { ...validData, goes_by: 'Johnny' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('allows optional phone_second', () => {
      const data = { ...validData, phone_second: '555-999-8888' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('allows optional education', () => {
      const data = { ...validData, education: 'high_school' };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('allows optional caregiver fields', () => {
      const data = { 
        ...validData, 
        caregiver_name: 'Caregiver Name',
        caregiver_relation: 'Friend',
        caregiver_phone: '555-111-2222',
      };
      const result = patientInformationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
