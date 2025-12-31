import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatPhoneNumber } from '@/utils/formatters';
import { formatDate } from '@/utils/dateUtils';
import type { PatientWithVisits } from '@/features/patients/types';
import toast from 'react-hot-toast';
import { patientUpdateService } from '@/services/patientUpdateService';

// Import actual intake form sections for editing
import { PatientIdentitySection } from '@/features/forms/intake/steps/sections/PatientIdentitySection';
import { DemographicsSection } from '@/features/forms/intake/steps/sections/DemographicsSection';
import { InsuranceSection } from '@/features/forms/intake/steps/sections/InsuranceSection';
import { EmploymentSection } from '@/features/forms/intake/steps/sections/EmploymentSection';
import { MaritalStatusSection } from '@/features/forms/intake/steps/sections/MaritalStatusSection';
import { MinorChildrenSection } from '@/features/forms/intake/steps/sections/MinorChildrenSection';
import { EmergencyContactSection } from '@/features/forms/intake/steps/sections/EmergencyContactSection';
import { ReferralSection } from '@/features/forms/intake/steps/sections/ReferralSection';
import { CertificationSection } from '@/features/forms/intake/steps/sections/CertificationSection';
import { DiagnosisSection } from '@/features/forms/intake/steps/Step2_MedicalInformation/DiagnosisSection';
import { PhysiciansSection } from '@/features/forms/intake/steps/Step2_MedicalInformation/PhysiciansSection';

interface PatientApplicationViewProps {
  patient: PatientWithVisits;
  onUpdate: () => void;
}

type EditSection = 'none' | 'personal' | 'demographics' | 'insurance' | 'employment' | 'marital' | 'emergency' | 'medical';

export const PatientApplicationView = ({ patient, onUpdate }: PatientApplicationViewProps) => {
  const [editingSection, setEditingSection] = useState<EditSection>('none');
  const [editData, setEditData] = useState<Partial<PatientWithVisits>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (section: EditSection) => {
    setEditingSection(section);
    setEditData(patient);
  };

  const handleCancel = () => {
    setEditingSection('none');
    setEditData({});
  };

  const handleUpdate = async (section: EditSection) => {
    setIsSaving(true);
    
    try {
      let result;
      
      switch (section) {
        case 'personal': {
          // Update personal info (identity)
          const personalResult = await patientUpdateService.updatePersonalInfo(patient.id, {
            first_name: editData.first_name,
            middle_name: editData.middle_name || null,
            last_name: editData.last_name,
            goes_by: editData.goes_by || null,
            dob: editData.dob,
            status: editData.status,
          });
          
          // Update contact info
          const contactResult = await patientUpdateService.updateContactInfo(patient.id, {
            email: editData.email || null,
            phone_primary: editData.phone_primary || null,
            phone_second: editData.phone_second || null,
            phone_other: editData.phone_other || null,
            address: editData.address || null,
            city: editData.city || null,
            county: editData.county || null,
            state: editData.state || null,
            zip: editData.zip || null,
          });
          
          // Update demographics
          const demographicsResult = await patientUpdateService.updateDemographics(patient.id, {
            ethnicity: editData.ethnicity || undefined,
            ethnicity_other: editData.ethnicity_other || undefined,
            language: editData.language || undefined,
            language_other: editData.language_other || undefined,
            education: editData.education || undefined,
          });
          
          // Update additional personal data (guardian, referral, certification, emergency_contact)
          const additionalResult = await patientUpdateService.updateAdditionalPersonalData(patient.id, {
            guardian_name: editData.guardian_name || null,
            guardian_relationship: editData.guardian_relationship || null,
            referral_source: editData.referral_source || null,
            referral_other: editData.referral_other || null,
            patient_signature: (editData as any).patient_signature || null,
            patient_printed_name: (editData as any).patient_printed_name || null,
            patient_signature_date: (editData as any).patient_signature_date || null,
            interviewed_by: (editData as any).interviewed_by || null,
            interviewed_date: (editData as any).interviewed_date || null,
            emergency_contact: editData.emergency_contact || null,
          });
          
          result = personalResult.success && contactResult.success && demographicsResult.success && additionalResult.success
            ? { success: true }
            : { success: false, error: 'Failed to update some fields' };
          break;
        }
          
        case 'medical':
          result = await patientUpdateService.updateMedicalInfo(patient.id, {
            diagnosis_primary: editData.diagnosis_primary || null,
            diagnosis_date: editData.diagnosis_date || null,
            mets_to: editData.mets_to || null,
            treatment_other: editData.treatment_other || null,
          });
          break;
          
        case 'insurance':
          result = await patientUpdateService.updateInsuranceInfo(patient.id, {
            has_insurance: editData.has_insurance,
            insurance_type: editData.insurance_type || null,
            is_veteran: editData.is_veteran,
            employment_status: editData.employment_status || null,
            employer_name: editData.employer_name || null,
            occupation: editData.occupation || null,
            marital_status: editData.marital_status || null,
            spouse_name: editData.spouse_name || null,
            spouse_cell: editData.spouse_cell || null,
            spouse_work: editData.spouse_work || null,
          });
          break;
          
        case 'emergency':
          result = await patientUpdateService.updateEmergencyContact(patient.id, {
            caregiver_name: editData.caregiver_name || null,
            caregiver_relation: editData.caregiver_relation || null,
            caregiver_phone: editData.caregiver_phone || null,
          });
          break;
          
        default:
          result = { success: false, error: 'Unknown section' };
      }
      
      if (result.success) {
        toast.success(`${section} section updated successfully!`);
        setEditingSection('none');
        setEditData({});
        onUpdate(); // Reload patient data
      } else {
        toast.error(result.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Format backend strings for display (e.g., "high_school" -> "High School")
  const formatDisplayValue = (value: string): string => {
    if (!value) return '';
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Map old relationship values to new constants
  const normalizeRelationship = (relation: string | null): string => {
    if (!relation) return '';
    const lower = relation.toLowerCase();
    // Map specific family relationships to generic categories
    if (lower === 'sister' || lower === 'brother') return 'sibling';
    if (lower === 'mother' || lower === 'father') return 'parent';
    if (lower === 'grandmother' || lower === 'grandfather') return 'grandparent';
    if (lower === 'son' || lower === 'daughter') return 'child';
    return lower;
  };

  // Convert patient data to form data format for intake form sections
  const patientToFormData = (patient: PatientWithVisits): any => {
    // Transform physicians from flat array to grouped structure
    const mercy_oncologists = patient.physicians
      ?.filter((p: any) => p.physician_type === 'mercy_oncologist')
      .map((p: any) => ({
        name: p.physician_name,
        location: p.physician_location,
        phone: p.physician_phone || '',
        fax: p.physician_fax || '',
      })) || [];

    const mercy_radiation = patient.physicians
      ?.filter((p: any) => p.physician_type === 'mercy_radiation')
      .map((p: any) => ({
        name: p.physician_name,
        location: p.physician_location,
        phone: p.physician_phone || '',
        fax: p.physician_fax || '',
      })) || [];

    const baptist_oncologists = patient.physicians
      ?.filter((p: any) => p.physician_type === 'baptist_oncologist')
      .map((p: any) => ({
        name: p.physician_name,
        location: p.physician_location,
        phone: p.physician_phone || '',
        fax: p.physician_fax || '',
      })) || [];

    const baptist_radiation = patient.physicians
      ?.filter((p: any) => p.physician_type === 'baptist_radiation')
      .map((p: any) => ({
        name: p.physician_name,
        location: p.physician_location,
        phone: p.physician_phone || '',
        fax: p.physician_fax || '',
      })) || [];

    const custom_physicians = patient.physicians
      ?.filter((p: any) => p.physician_type === 'custom')
      .map((p: any) => ({
        name: p.physician_name,
        location: p.physician_location,
        phone: p.physician_phone || '',
        fax: p.physician_fax || '',
      })) || [];

    return {
      // Identity
      first_name: patient.first_name,
      middle_name: patient.middle_name || '',
      last_name: patient.last_name,
      goes_by: patient.goes_by || '',
      dob: patient.dob,
      status: patient.status || 'female',
      // Contact
      email: patient.email || '',
      phone_primary: patient.phone_primary || '',
      phone_second: patient.phone_second || '',
      phone_other: patient.phone_other || '',
      address: patient.address || '',
      city: patient.city || '',
      county: patient.county || '',
      state: patient.state || '',
      zip: patient.zip || '',
      // Demographics
      ethnicity: patient.ethnicity || [],
      ethnicity_other: patient.ethnicity_other || '',
      language: patient.language || [],
      language_other: patient.language_other || '',
      education: patient.education || '',
      // Insurance
      has_insurance: patient.has_insurance || false,
      insurance_type: patient.insurance_type || [],
      is_veteran: patient.is_veteran || false,
      // Employment
      employment_status: patient.employment_status || '',
      employer_name: patient.employer_name || '',
      occupation: patient.occupation || '',
      home_has_employed: patient.home_has_employed || false,
      // Marital
      marital_status: patient.marital_status || '',
      spouse_name: patient.spouse_name || '',
      spouse_cell: patient.spouse_cell || '',
      spouse_work: patient.spouse_work || '',
      // Emergency & Caregiver
      caregiver_name: patient.caregiver_name || '',
      caregiver_relation: patient.caregiver_relation || '',
      caregiver_phone: patient.caregiver_phone || '',
      // Emergency contact - use existing data or create from caregiver as fallback
      emergency_contact: patient.emergency_contact || {
        name: patient.caregiver_name || '',
        relationship: normalizeRelationship(patient.caregiver_relation),
        phone: patient.caregiver_phone || '',
        address: '',
        city: '',
        state: '',
        zip: '',
      },
      // Medical - Diagnosis
      diagnosis_primary: patient.diagnosis_primary || '',
      diagnosis_date: patient.diagnosis_date || '',
      mets_to: patient.mets_to || '',
      treatment_other: patient.treatment_other || '',
      // Medical - Physicians (transformed to grouped structure)
      mercy_oncologists,
      mercy_radiation,
      baptist_oncologists,
      baptist_radiation,
      custom_physicians,
      // Medical - Treatment History
      surgeries: patient.surgeries || [],
      chemo_cycles: patient.chemo_cycles || [],
      radiation_treatments: patient.radiation_treatments || [],
      // Minor children (may not be in Patient type yet)
      has_minor_children: (patient as any).has_minor_children || false,
      minor_children: (patient as any).minor_children || [],
      minor_children_count: (patient as any).minor_children_count || '',
      guardian_name: patient.guardian_name || '',
      guardian_relationship: patient.guardian_relationship || '',
      // Referral
      referral_source: patient.referral_source || '',
      referral_other: patient.referral_other || '',
      // Certification - use actual patient signature data
      patient_signature: patient.patient_signature || '',
      patient_printed_name: patient.patient_printed_name || '',
      patient_signature_date: patient.patient_signature_date || '',
      interviewed_by: patient.interviewed_by || '',
      interviewed_date: patient.interviewed_date || '',
    };
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {editingSection !== 'personal' ? (
            <Button size="sm" variant="outline" onClick={() => handleEdit('personal')}>
              ✏️ Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleUpdate('personal')}>
                💾 Update
              </Button>
            </div>
          )}
        </div>
        
        {editingSection === 'personal' ? (
          <div className="space-y-6">
            <PatientIdentitySection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
            <DemographicsSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
            <MinorChildrenSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
            <ReferralSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
            <CertificationSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Identity */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Identity</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Full Name:</span>
                  <span className="ml-2 font-medium">
                    {patient.first_name} {patient.middle_name} {patient.last_name}
                  </span>
                </div>
                {patient.goes_by && (
                  <div>
                    <span className="text-gray-600">Goes By:</span>
                    <span className="ml-2 font-medium">{patient.goes_by}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="ml-2 font-medium">{formatDate(patient.dob)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <span className="ml-2 font-medium capitalize">{patient.status}</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{patient.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Primary Phone:</span>
                  <span className="ml-2 font-medium">{formatPhoneNumber(patient.phone_primary)}</span>
                </div>
                {patient.phone_second && (
                  <div>
                    <span className="text-gray-600">Secondary Phone:</span>
                    <span className="ml-2 font-medium">{formatPhoneNumber(patient.phone_second)}</span>
                  </div>
                )}
                {patient.phone_other && (
                  <div>
                    <span className="text-gray-600">Other Phone:</span>
                    <span className="ml-2 font-medium">{formatPhoneNumber(patient.phone_other)}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-gray-600">Address:</span>
                  <span className="ml-2 font-medium">
                    {patient.address}, {patient.city}, {patient.state} {patient.zip}
                  </span>
                </div>
                {patient.county && (
                  <div>
                    <span className="text-gray-600">County:</span>
                    <span className="ml-2 font-medium">{patient.county}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Demographics */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Demographics</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {patient.ethnicity && patient.ethnicity.length > 0 && (
                  <div>
                    <span className="text-gray-600">Ethnicity:</span>
                    <span className="ml-2 font-medium">
                      {patient.ethnicity.map(e => formatDisplayValue(e)).join(', ')}
                    </span>
                  </div>
                )}
                {patient.ethnicity_other && (
                  <div>
                    <span className="text-gray-600">Ethnicity (Other):</span>
                    <span className="ml-2 font-medium">{patient.ethnicity_other}</span>
                  </div>
                )}
                {patient.language && patient.language.length > 0 && (
                  <div>
                    <span className="text-gray-600">Language:</span>
                    <span className="ml-2 font-medium">
                      {patient.language.map(l => formatDisplayValue(l)).join(', ')}
                    </span>
                  </div>
                )}
                {patient.language_other && (
                  <div>
                    <span className="text-gray-600">Language (Other):</span>
                    <span className="ml-2 font-medium">{patient.language_other}</span>
                  </div>
                )}
                {patient.education && (
                  <div>
                    <span className="text-gray-600">Education:</span>
                    <span className="ml-2 font-medium">{formatDisplayValue(patient.education)}</span>
                  </div>
                )}
                {patient.is_veteran && (
                  <div>
                    <span className="text-gray-600 font-medium">🎖️ Veteran</span>
                  </div>
                )}
              </div>
            </div>

            {/* Minor Children */}
            {(patient as any).has_minor_children && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Minor Children</h4>
                <div className="text-sm">
                  <div>
                    <span className="text-gray-600">Has Minor Children:</span>
                    <span className="ml-2 font-medium">Yes</span>
                  </div>
                  {(patient as any).minor_children_count && (
                    <div className="mt-2">
                      <span className="text-gray-600">Number of Children:</span>
                      <span className="ml-2 font-medium">{(patient as any).minor_children_count}</span>
                    </div>
                  )}
                  {patient.guardian_name && (
                    <div className="mt-2">
                      <span className="text-gray-600">Guardian Name:</span>
                      <span className="ml-2 font-medium">{patient.guardian_name}</span>
                    </div>
                  )}
                  {patient.guardian_relationship && (
                    <div className="mt-2">
                      <span className="text-gray-600">Guardian Relationship:</span>
                      <span className="ml-2 font-medium">{formatDisplayValue(patient.guardian_relationship)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Referral */}
            {patient.referral_source && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Referral Source</h4>
                <div className="text-sm">
                  <div>
                    <span className="text-gray-600">How did you hear about us:</span>
                    <span className="ml-2 font-medium">{formatDisplayValue(patient.referral_source)}</span>
                  </div>
                  {patient.referral_other && (
                    <div className="mt-2">
                      <span className="text-gray-600">Referral Details:</span>
                      <span className="ml-2 font-medium">{patient.referral_other}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certification */}
            {patient.patient_signature && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Patient Certification</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Signature:</span>
                    <span className="ml-2 font-medium">✓ Signed</span>
                  </div>
                  {patient.patient_signature_date && (
                    <div>
                      <span className="text-gray-600">Signature Date:</span>
                      <span className="ml-2 font-medium">{formatDate(patient.patient_signature_date)}</span>
                    </div>
                  )}
                  {patient.patient_printed_name && (
                    <div>
                      <span className="text-gray-600">Printed Name:</span>
                      <span className="ml-2 font-medium">{patient.patient_printed_name}</span>
                    </div>
                  )}
                  {patient.interviewed_by && (
                    <div>
                      <span className="text-gray-600">Interviewed By:</span>
                      <span className="ml-2 font-medium">{patient.interviewed_by}</span>
                    </div>
                  )}
                  {patient.interviewed_date && (
                    <div>
                      <span className="text-gray-600">Interview Date:</span>
                      <span className="ml-2 font-medium">{formatDate(patient.interviewed_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>


      {/* Medical Information Section */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
          {editingSection !== 'medical' ? (
            <Button size="sm" variant="outline" onClick={() => handleEdit('medical')}>
              ✏️ Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleUpdate('medical')}>
                💾 Update
              </Button>
            </div>
          )}
        </div>
        
        {editingSection === 'medical' ? (
          <div className="space-y-6">
            <DiagnosisSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
            <PhysiciansSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Diagnosis */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {patient.diagnosis_primary && (
                  <div>
                    <span className="text-gray-600">Primary Diagnosis:</span>
                    <span className="ml-2 font-medium">{patient.diagnosis_primary}</span>
                  </div>
                )}
                {patient.diagnosis_date && (
                  <div>
                    <span className="text-gray-600">Diagnosis Date:</span>
                    <span className="ml-2 font-medium">{formatDate(patient.diagnosis_date)}</span>
                  </div>
                )}
                {patient.mets_to && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Metastasis To:</span>
                    <span className="ml-2 font-medium">{patient.mets_to}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Physicians */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Physicians</h4>
              <div className="space-y-3 text-sm">
                {patient.physicians && patient.physicians.length > 0 ? (
                  <>
                    {patient.physicians.filter((p: any) => p.physician_type === 'mercy_oncologist').length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Mercy Oncologists:</span>
                        <div className="ml-2 mt-1 space-y-1">
                          {patient.physicians
                            .filter((p: any) => p.physician_type === 'mercy_oncologist')
                            .map((p: any, idx: number) => (
                              <div key={idx}>
                                {p.physician_name} - {p.physician_location}
                                {p.physician_phone && ` | Phone: ${p.physician_phone}`}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {patient.physicians.filter((p: any) => p.physician_type === 'baptist_oncologist').length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Baptist Oncologists:</span>
                        <div className="ml-2 mt-1 space-y-1">
                          {patient.physicians
                            .filter((p: any) => p.physician_type === 'baptist_oncologist')
                            .map((p: any, idx: number) => (
                              <div key={idx}>
                                {p.physician_name} - {p.physician_location}
                                {p.physician_phone && ` | Phone: ${p.physician_phone}`}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {patient.physicians.filter((p: any) => p.physician_type === 'mercy_radiation').length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Mercy Radiation Oncologists:</span>
                        <div className="ml-2 mt-1 space-y-1">
                          {patient.physicians
                            .filter((p: any) => p.physician_type === 'mercy_radiation')
                            .map((p: any, idx: number) => (
                              <div key={idx}>
                                {p.physician_name} - {p.physician_location}
                                {p.physician_phone && ` | Phone: ${p.physician_phone}`}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {patient.physicians.filter((p: any) => p.physician_type === 'baptist_radiation').length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Baptist Radiation Oncologists:</span>
                        <div className="ml-2 mt-1 space-y-1">
                          {patient.physicians
                            .filter((p: any) => p.physician_type === 'baptist_radiation')
                            .map((p: any, idx: number) => (
                              <div key={idx}>
                                {p.physician_name} - {p.physician_location}
                                {p.physician_phone && ` | Phone: ${p.physician_phone}`}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {patient.physicians.filter((p: any) => p.physician_type === 'custom').length > 0 && (
                      <div>
                        <span className="text-gray-600 font-medium">Other Physicians:</span>
                        <div className="ml-2 mt-1 space-y-1">
                          {patient.physicians
                            .filter((p: any) => p.physician_type === 'custom')
                            .map((p: any, idx: number) => (
                              <div key={idx}>
                                {p.physician_name} - {p.physician_location}
                                {p.physician_phone && ` | Phone: ${p.physician_phone}`}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500">No physicians listed</div>
                )}
              </div>
            </div>

            {/* Treatment History */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Treatment History</h4>
              <div className="space-y-3 text-sm">
                {/* Surgeries */}
                {patient.surgeries && patient.surgeries.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Surgeries:</span>
                    <div className="ml-2 mt-1 space-y-1">
                      {patient.surgeries.map((surgery: any, idx: number) => (
                        <div key={idx}>
                          {formatDate(surgery.date)}
                          {surgery.notes && ` - ${surgery.notes}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Chemo Cycles */}
                {patient.chemo_cycles && patient.chemo_cycles.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Chemotherapy Cycles:</span>
                    <div className="ml-2 mt-1 space-y-1">
                      {patient.chemo_cycles.map((cycle: any, idx: number) => (
                        <div key={idx}>
                          {formatDate(cycle.start_date)} to {formatDate(cycle.end_date)}
                          {cycle.notes && ` - ${cycle.notes}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Radiation Treatments */}
                {patient.radiation_treatments && patient.radiation_treatments.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Radiation Treatments:</span>
                    <div className="ml-2 mt-1 space-y-1">
                      {patient.radiation_treatments.map((treatment: any, idx: number) => (
                        <div key={idx}>
                          {formatDate(treatment.start_date)} to {formatDate(treatment.end_date)}
                          {treatment.notes && ` - ${treatment.notes}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Other Treatment */}
                {patient.treatment_other && (
                  <div>
                    <span className="text-gray-600 font-medium">Other Treatment:</span>
                    <div className="ml-2 mt-1">{patient.treatment_other}</div>
                  </div>
                )}
                
                {/* No treatments message */}
                {(!patient.surgeries || patient.surgeries.length === 0) &&
                 (!patient.chemo_cycles || patient.chemo_cycles.length === 0) &&
                 (!patient.radiation_treatments || patient.radiation_treatments.length === 0) &&
                 !patient.treatment_other && (
                  <div className="text-gray-500">No treatment history recorded</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Insurance & Benefits Section */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Insurance & Benefits</h3>
          {editingSection !== 'insurance' ? (
            <Button size="sm" variant="outline" onClick={() => handleEdit('insurance')}>
              ✏️ Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleUpdate('insurance')}>
                💾 Update
              </Button>
            </div>
          )}
        </div>
        
        {editingSection === 'insurance' ? (
          <div className="space-y-6">
            <InsuranceSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
            <EmploymentSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
            <MaritalStatusSection
              formData={patientToFormData(editData as PatientWithVisits)}
              onChange={handleChange}
              errors={{}}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Insurance */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Insurance</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Has Insurance:</span>
                  <span className="ml-2 font-medium">{patient.has_insurance ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Insurance Type:</span>
                  <span className="ml-2 font-medium">
                    {patient.insurance_type && Array.isArray(patient.insurance_type) && patient.insurance_type.length > 0
                      ? patient.insurance_type.map(t => formatDisplayValue(t)).join(', ')
                      : 'Not provided'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Veteran Status:</span>
                  <span className="ml-2 font-medium">
                    {patient.is_veteran ? '🎖️ Yes, Veteran' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Employment</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {patient.employment_status && (
                  <div>
                    <span className="text-gray-600">Employment Status:</span>
                    <span className="ml-2 font-medium">{formatDisplayValue(patient.employment_status)}</span>
                  </div>
                )}
                {patient.employer_name && (
                  <div>
                    <span className="text-gray-600">Employer Name:</span>
                    <span className="ml-2 font-medium">{patient.employer_name}</span>
                  </div>
                )}
                {patient.occupation && (
                  <div>
                    <span className="text-gray-600">Occupation:</span>
                    <span className="ml-2 font-medium">{patient.occupation}</span>
                  </div>
                )}
                {patient.home_has_employed !== null && (
                  <div>
                    <span className="text-gray-600">Anyone in Household Employed:</span>
                    <span className="ml-2 font-medium">{patient.home_has_employed ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Marital Status</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {patient.marital_status && (
                  <div>
                    <span className="text-gray-600">Marital Status:</span>
                    <span className="ml-2 font-medium">{formatDisplayValue(patient.marital_status)}</span>
                  </div>
                )}
                {patient.spouse_name && (
                  <div>
                    <span className="text-gray-600">Spouse Name:</span>
                    <span className="ml-2 font-medium">{patient.spouse_name}</span>
                  </div>
                )}
                {patient.spouse_cell && (
                  <div>
                    <span className="text-gray-600">Spouse Cell Phone:</span>
                    <span className="ml-2 font-medium">{formatPhoneNumber(patient.spouse_cell)}</span>
                  </div>
                )}
                {patient.spouse_work && (
                  <div>
                    <span className="text-gray-600">Spouse Work Phone:</span>
                    <span className="ml-2 font-medium">{formatPhoneNumber(patient.spouse_work)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Emergency Contact Section */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          {editingSection !== 'emergency' ? (
            <Button size="sm" variant="outline" onClick={() => handleEdit('emergency')}>
              ✏️ Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleUpdate('emergency')}>
                💾 Update
              </Button>
            </div>
          )}
        </div>
        
        {editingSection === 'emergency' ? (
          <EmergencyContactSection
            formData={patientToFormData(editData as PatientWithVisits)}
            onChange={handleChange}
            errors={{}}
          />
        ) : (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-2">Emergency Contact</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">
                  {patient.emergency_contact?.name || patient.caregiver_name || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Relationship:</span>
                <span className="ml-2 font-medium">
                  {formatDisplayValue(patient.emergency_contact?.relationship || patient.caregiver_relation || 'Not provided')}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Address:</span>
                <span className="ml-2 font-medium">
                  {patient.emergency_contact?.address || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">City:</span>
                <span className="ml-2 font-medium">
                  {patient.emergency_contact?.city || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">State:</span>
                <span className="ml-2 font-medium">
                  {patient.emergency_contact?.state || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">ZIP:</span>
                <span className="ml-2 font-medium">
                  {patient.emergency_contact?.zip || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium">
                  {formatPhoneNumber(patient.emergency_contact?.phone || patient.caregiver_phone) || 'Not provided'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Visit History Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Visit History ({patient.visits?.length || 0})
        </h3>
        <div className="space-y-2 text-sm mb-4">
          <div>
            <span className="text-gray-600">Total Visits:</span>
            <span className="ml-2 font-medium text-2xl text-purple-600">{patient.visit_count || 0}</span>
          </div>
          <div>
            <span className="text-gray-600">Last Visit:</span>
            <span className="ml-2 font-medium">
              {patient.last_visit_date ? formatDate(patient.last_visit_date) : 'Never'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium capitalize">{patient.patient_status}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
