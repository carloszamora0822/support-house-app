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
      console.log(' INTAKE FORM SUBMISSION PAYLOAD:');
      console.log('=====================================');
      console.log('Full formData:', JSON.stringify(formData, null, 2));
      console.log('=====================================');
      console.log('Patient Data:', formData.patientData);
      console.log('Medical Data:', formData.medicalData);
      console.log('Disclosure Data:', formData.disclosureData);
      console.log('=====================================');

      // Get current user for created_by field
      const { data: { user } } = await supabase.auth.getUser();
      
      // Step 1: Create patient record with all fields from UI
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          // Identity
          first_name: formData.patientData.first_name,
          middle_name: formData.patientData.middle_name || null,
          last_name: formData.patientData.last_name,
          goes_by: formData.patientData.goes_by || null,
          dob: formData.patientData.dob,
          
          // Contact
          email: formData.patientData.email || null,
          phone_primary: formData.patientData.phone_primary || null,
          phone_second: formData.patientData.phone_second || null,
          phone_other: formData.patientData.phone_other || null,
          
          // Address
          address: formData.patientData.address || null,
          city: formData.patientData.city || null,
          county: formData.patientData.county || null,
          state: formData.patientData.state || null,
          zip: formData.patientData.zip || null,
          
          // Demographics
          status: formData.patientData.status || 'female',
          ethnicity: formData.patientData.ethnicity || [],
          ethnicity_other: formData.patientData.ethnicity_other || null,
          language: formData.patientData.language || [],
          language_other: formData.patientData.language_other || null,
          education: formData.patientData.education || null,
          
          // Guardian (if applicable)
          guardian_name: formData.patientData.guardian_name || null,
          guardian_relationship: formData.patientData.guardian_relationship || null,
          
          // Insurance & Veteran
          has_insurance: formData.patientData.has_insurance || false,
          insurance_type: formData.patientData.insurance_type || [],
          is_veteran: formData.patientData.is_veteran || false,
          
          // Employment
          employment_status: formData.patientData.employment_status || null,
          employer_name: formData.patientData.employer_name || null,
          occupation: formData.patientData.occupation || null,
          home_has_employed: formData.patientData.home_has_employed || false,
          
          // Marital & Caregiver
          marital_status: formData.patientData.marital_status || null,
          spouse_name: formData.patientData.spouse_name || null,
          spouse_cell: formData.patientData.spouse_cell || null,
          spouse_work: formData.patientData.spouse_work || null,
          caregiver_name: formData.patientData.caregiver_name || null,
          caregiver_relation: formData.patientData.caregiver_relation || null,
          caregiver_phone: formData.patientData.caregiver_phone || null,
          
          // Medical Information
          diagnosis_primary: formData.medicalData.diagnosis_primary || null,
          diagnosis_date: formData.medicalData.diagnosis_date || null,
          mets_to: formData.medicalData.mets_to || null,
          treatment_other: formData.medicalData.treatment_other || null,
          
          // Medical release tracking
          has_received_medical_release: false, // Initially false - waiting for signed form
          medical_release_sent_date: new Date().toISOString(), // Set to now when form is generated
          
          // Referral & Assistance
          referral_source: formData.patientData.referral_source || null,
          referral_other: formData.patientData.referral_other || null,
          assistance_types: formData.patientData.assistance_types || [],
          assistance_other: formData.patientData.assistance_other || null,
          patient_signature: formData.patientData.patient_signature || null,
          patient_printed_name: formData.patientData.patient_printed_name || null,
          patient_signature_date: formData.patientData.patient_signature_date || null,
          interviewed_by: formData.patientData.interviewed_by || null,
          interviewed_date: formData.patientData.interviewed_date || null,
          
          // Tracking
          initial_visit_date: new Date().toISOString().split('T')[0],
          visit_count: 0,
          patient_status: 'active',
          created_by: user?.id || null,
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
      const { data: visit, error: visitError } = await supabase
        .from('visits')
        .insert({
          patient_id: patientId,
          visit_type: 'intake',
          check_in_timestamp: new Date().toISOString(),
          assistance_requested: [],
        })
        .select()
        .single();

      if (visitError || !visit) {
        return {
          success: false,
          error: `Failed to create visit: ${visitError?.message || 'Unknown error'}`,
        };
      }

      const visitId = visit.id;

      // Step 3: Create emergency contact if provided
      if (formData.patientData.emergency_contact?.name) {
        const { error: emergencyError } = await supabase
          .from('emergency_contacts')
          .insert({
            patient_id: patientId,
            name: formData.patientData.emergency_contact.name,
            relationship: formData.patientData.emergency_contact.relationship || null,
            address: formData.patientData.emergency_contact.address || null,
            city: formData.patientData.emergency_contact.city || null,
            state: formData.patientData.emergency_contact.state || null,
            zip: formData.patientData.emergency_contact.zip || null,
            phone: formData.patientData.emergency_contact.phone || null,
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

      // Step 5: Create surgery records if provided
      if (formData.medicalData.surgeries && formData.medicalData.surgeries.length > 0) {
        const surgeryRecords = formData.medicalData.surgeries.map((surgery: any) => ({
          patient_id: patientId,
          date: surgery.date,
          notes: surgery.notes || null,
          created_by: user?.id || null,
        }));

        const { error: surgeryError } = await supabase
          .from('surgeries')
          .insert(surgeryRecords);

        if (surgeryError) {
          return {
            success: false,
            error: `Failed to create surgery records: ${surgeryError.message}`,
          };
        }
      }

      // Step 6: Create chemo cycle records if provided
      if (formData.medicalData.chemo_cycles && formData.medicalData.chemo_cycles.length > 0) {
        const chemoCycleRecords = formData.medicalData.chemo_cycles.map((cycle: any) => ({
          patient_id: patientId,
          start_date: cycle.start_date,
          end_date: cycle.end_date,
          notes: cycle.notes || null,
          created_by: user?.id || null,
        }));

        const { error: chemoError } = await supabase
          .from('chemo_cycles')
          .insert(chemoCycleRecords);

        if (chemoError) {
          return {
            success: false,
            error: `Failed to create chemo cycle records: ${chemoError.message}`,
          };
        }
      }

      // Step 7: Create radiation treatment records if provided
      if (formData.medicalData.radiation_treatments && formData.medicalData.radiation_treatments.length > 0) {
        const radiationRecords = formData.medicalData.radiation_treatments.map((treatment: any) => ({
          patient_id: patientId,
          start_date: treatment.start_date,
          end_date: treatment.end_date,
          notes: treatment.notes || null,
          created_by: user?.id || null,
        }));

        const { error: radiationError } = await supabase
          .from('radiation_treatments')
          .insert(radiationRecords);

        if (radiationError) {
          return {
            success: false,
            error: `Failed to create radiation treatment records: ${radiationError.message}`,
          };
        }
      }

      // Step 8: Create physician records
      const allPhysicians = [
        ...(formData.medicalData.mercy_oncologists || []).map((p: any) => ({ ...p, type: 'mercy_oncologist' })),
        ...(formData.medicalData.mercy_radiation || []).map((p: any) => ({ ...p, type: 'mercy_radiation' })),
        ...(formData.medicalData.baptist_oncologists || []).map((p: any) => ({ ...p, type: 'baptist_oncologist' })),
        ...(formData.medicalData.baptist_radiation || []).map((p: any) => ({ ...p, type: 'baptist_radiation' })),
        ...(formData.medicalData.custom_physicians || []).map((p: any) => ({ ...p, type: 'custom' })),
      ];

      console.log('🏥 All physicians to save:', allPhysicians);

      if (allPhysicians.length > 0) {
        const physicianRecords = allPhysicians.map((physician: any) => ({
          patient_id: patientId,
          physician_name: physician.name,
          physician_location: physician.location,
          physician_phone: physician.phone || null,
          physician_fax: physician.fax || null,
          physician_type: physician.type,
          created_by: user?.id || null,
        }));

        console.log('💾 Physician records to insert:', physicianRecords);

        const { error: physicianError } = await supabase
          .from('patient_physicians')
          .insert(physicianRecords);

        if (physicianError) {
          return {
            success: false,
            error: `Failed to create physician records: ${physicianError.message}`,
          };
        }
      }

      // Step 9: Create disclosure form record if signature provided
      if (formData.disclosureData.fax_patient_signature) {
        const { error: disclosureError } = await supabase
          .from('disclosure_forms')
          .insert({
            patient_id: patientId,
            // Required fields - no null
            fax_form_date: formData.disclosureData.fax_form_date,
            fax_to_office: formData.disclosureData.fax_to_office,
            fax_patient_name: formData.disclosureData.fax_patient_name,
            fax_patient_dob: formData.disclosureData.fax_patient_dob,
            fax_patient_address: formData.disclosureData.fax_patient_address,
            fax_patient_city: formData.disclosureData.fax_patient_city,
            fax_patient_state: formData.disclosureData.fax_patient_state,
            fax_patient_zip: formData.disclosureData.fax_patient_zip,
            fax_patient_phone: formData.disclosureData.fax_patient_phone,
            office_patient_diagnosis: formData.disclosureData.office_patient_diagnosis,
            office_staff_signature: formData.disclosureData.office_staff_signature,
            office_staff_signature_date: formData.disclosureData.office_staff_signature_date,
            fax_patient_signature: formData.disclosureData.fax_patient_signature,
            fax_patient_signature_date: formData.disclosureData.fax_patient_signature_date,
            fax_patient_printed_name: formData.disclosureData.fax_patient_printed_name,
            // Optional fields - can be null
            office_stage: formData.disclosureData.office_stage || null,
            office_expected_treatments: formData.disclosureData.office_expected_treatments || null,
            office_treatment_start_date: formData.disclosureData.office_treatment_start_date || null,
            office_treatment_end_date: formData.disclosureData.office_treatment_end_date || null,
            office_chemo_type: formData.disclosureData.office_chemo_type || [],
            office_chemo_frequency: formData.disclosureData.office_chemo_frequency || null,
            office_chemo_every_weeks: formData.disclosureData.office_chemo_every_weeks || null,
            office_radiation_frequency: formData.disclosureData.office_radiation_frequency || null,
            office_radiation_every_weeks: formData.disclosureData.office_radiation_every_weeks || null,
            office_status_flags: formData.disclosureData.office_status_flags || [],
            fax_rep_relationship: formData.disclosureData.fax_rep_relationship || null,
            created_by: user?.id || null,
          })
          .select()
          .single();

        if (disclosureError) {
          return {
            success: false,
            error: `Failed to create disclosure form: ${disclosureError.message}`,
          };
        }

        // Step 10: Generate and upload disclosure PDF
        console.log('📄 Generating disclosure PDF...');
        const { pdfService } = await import('./pdfService');
        const { documentService } = await import('@/services/documentService');
        
        try {
          const pdfBlob = await pdfService.generateDisclosurePDF(formData.disclosureData);
          console.log('✅ PDF generated, size:', pdfBlob.size);

          const patientName = `${formData.patientData.first_name} ${formData.patientData.last_name}`;
          const documentName = `ReynoldsCancerSupportHouse: ${patientName}, Outform`;

          const uploadResult = await documentService.uploadDocument({
            patientId: patientId,
            documentType: 'disclosure_form',
            documentName: documentName,
            pdfBlob: pdfBlob,
            expiresInDays: 365, // 1 year expiry
            notes: 'Generated during intake form submission',
          });

          if (!uploadResult.success) {
            console.error('⚠️ Failed to upload PDF:', uploadResult.error);
            // Don't fail the entire submission if PDF upload fails
          } else {
            console.log('✅ PDF uploaded successfully, document ID:', uploadResult.documentId);
          }
        } catch (pdfError) {
          console.error('⚠️ Error generating/uploading PDF:', pdfError);
          // Don't fail the entire submission if PDF generation fails
        }

        // Step 11: Create pending task for staff to upload signed medical release
        console.log('📋 Creating pending task for medical release upload...');
        const { taskService } = await import('@/services/taskService');
        
        try {
          const taskResult = await taskService.createTask({
            patientId: patientId,
            taskType: 'upload_medical_release',
            title: `Upload signed medical release for ${formData.patientData.first_name} ${formData.patientData.last_name}`,
            description: `Pre-filled disclosure form has been generated and sent to medical provider. Waiting for signed form to be returned. Once received, upload the signed PDF and enter medical staff information.`,
            priority: 'medium',
          });

          if (taskResult.success) {
            console.log('✅ Pending task created:', taskResult.task?.id);
          } else {
            console.error('⚠️ Failed to create pending task:', taskResult.error);
          }
        } catch (taskError) {
          console.error('⚠️ Error creating pending task:', taskError);
          // Don't fail submission if task creation fails
        }
      }

      // Step 12: Save detailed assistance items if any were provided
      if (formData.patientData.assistanceItems && formData.patientData.assistanceItems.length > 0 && visitId) {
        console.log('📦 Saving assistance items...');
        const { assistanceItemService } = await import('@/services/assistanceItemService');
        
        try {
          const assistanceResult = await assistanceItemService.createAssistanceItems(
            visitId,
            patientId,
            formData.patientData.assistanceItems
          );

          if (assistanceResult.success) {
            console.log('✅ Assistance items saved:', formData.patientData.assistanceItems.length);
          } else {
            console.error('⚠️ Failed to save assistance items:', assistanceResult.error);
          }
        } catch (assistanceError) {
          console.error('⚠️ Error saving assistance items:', assistanceError);
          // Don't fail submission if assistance items fail
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
