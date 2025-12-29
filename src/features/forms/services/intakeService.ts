import { supabase } from '@/lib/supabase';

interface IntakeFormData {
  patientData: any;
  medicalData: any;
  disclosureData: any;
}

interface SubmitResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const intakeService = {
  async submitIntakeForm(formData: IntakeFormData): Promise<SubmitResult> {
    try {
      // Step 1: Create patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name_first: formData.patientData.name_first,
          name_last: formData.patientData.name_last,
          dob: formData.patientData.dob,
          email: formData.patientData.email,
          phone_primary: formData.patientData.phone_primary,
          phone_second: formData.patientData.phone_second,
          phone_other: formData.patientData.phone_other,
          address: formData.patientData.address,
          city: formData.patientData.city,
          state: formData.patientData.state,
          zip: formData.patientData.zip,
          goes_by: formData.patientData.goes_by,
          patient_status: formData.patientData.patient_status || 'active',
          ethnicity: formData.patientData.ethnicity,
          language: formData.patientData.language,
          education: formData.patientData.education,
          insurance: formData.patientData.insurance,
          insurance_types: formData.patientData.insurance_types,
          veteran: formData.patientData.veteran,
          marital_status: formData.patientData.marital_status,
          spouse_name: formData.patientData.spouse_name,
          caregiver_name: formData.patientData.caregiver_name,
          caregiver_relationship: formData.patientData.caregiver_relationship,
          minor_children_count: formData.patientData.minor_children_count || 0,
          employment_status: formData.patientData.employment_status,
          employer: formData.patientData.employer,
          referral_source: formData.patientData.referral_source,
          visit_count: 0,
        })
        .select()
        .single();

      if (patientError) {
        return {
          success: false,
          error: `Failed to create patient: ${patientError.message}`,
        };
      }

      const patientId = patient.id;

      // Step 2: Create initial visit record (intake type)
      const { error: visitError } = await supabase
        .from('visits')
        .insert({
          patient_id: patientId,
          visit_type: 'intake',
          check_in_timestamp: new Date().toISOString(),
          assistance_requested: [],
        })
        .select()
        .single();

      if (visitError) {
        return {
          success: false,
          error: `Failed to create visit: ${visitError.message}`,
        };
      }

      // Step 3: Create emergency contact if provided
      if (formData.patientData.emergency_contact_name) {
        const { error: emergencyError } = await supabase
          .from('emergency_contacts')
          .insert({
            patient_id: patientId,
            name: formData.patientData.emergency_contact_name,
            relationship: formData.patientData.emergency_contact_relationship,
            phone: formData.patientData.emergency_contact_phone,
          })
          .select()
          .single();

        if (emergencyError) {
          return {
            success: false,
            error: `Failed to create emergency contact: ${emergencyError.message}`,
          };
        }
      }

      // Step 4: Create minor children records if provided
      if (formData.patientData.minor_children && formData.patientData.minor_children.length > 0) {
        const childrenRecords = formData.patientData.minor_children.map((child: any) => ({
          patient_id: patientId,
          name: child.name,
          age: child.age,
        }));

        const { error: childrenError } = await supabase
          .from('minor_children')
          .insert(childrenRecords);

        if (childrenError) {
          return {
            success: false,
            error: `Failed to create minor children records: ${childrenError.message}`,
          };
        }
      }

      // Step 5: Create disclosure form record if signature provided
      if (formData.disclosureData.fax_patient_signature) {
        const { error: disclosureError } = await supabase
          .from('disclosure_forms')
          .insert({
            patient_id: patientId,
            form_date: formData.disclosureData.fax_form_date,
            fax_to_office: formData.disclosureData.fax_to_office,
            patient_signature: formData.disclosureData.fax_patient_signature,
            patient_signature_date: formData.disclosureData.fax_patient_signature_date,
            patient_printed_name: formData.disclosureData.fax_patient_printed_name,
            representative_relationship: formData.disclosureData.fax_rep_relationship,
            office_staff_signature: formData.disclosureData.office_staff_signature,
            office_staff_signature_date: formData.disclosureData.office_staff_signature_date,
            diagnosis: formData.disclosureData.office_patient_diagnosis,
            stage: formData.disclosureData.office_stage,
            expected_treatments: formData.disclosureData.office_expected_treatments,
            treatment_start_date: formData.disclosureData.office_treatment_start_date,
            treatment_end_date: formData.disclosureData.office_treatment_end_date,
          })
          .select()
          .single();

        if (disclosureError) {
          return {
            success: false,
            error: `Failed to create disclosure form: ${disclosureError.message}`,
          };
        }
      }

      return {
        success: true,
        data: patient,
      };
    } catch (error) {
      return {
        success: false,
        error: `Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
};
