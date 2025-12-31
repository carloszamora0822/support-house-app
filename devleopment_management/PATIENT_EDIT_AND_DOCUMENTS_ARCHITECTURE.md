# Patient Edit & Document Management Architecture

## Overview
Modular system for:
1. Storing PDFs with patient records
2. Tracking document expiry (1 year validity)
3. Editing patient information using reusable intake components
4. Partial form updates (edit disclosure only, medical only, etc.)

---

## 1. DATABASE SCHEMA

### New Table: `patient_documents`
```sql
CREATE TABLE patient_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('disclosure_form', 'intake_form', 'other')),
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size INTEGER,
  mime_type TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- 1 year from created_at for disclosure forms
  is_expired BOOLEAN GENERATED ALWAYS AS (expires_at < NOW()) STORED,
  created_by UUID REFERENCES users(id),
  notes TEXT
);

CREATE INDEX idx_patient_documents_patient_id ON patient_documents(patient_id);
CREATE INDEX idx_patient_documents_expires_at ON patient_documents(expires_at);
CREATE INDEX idx_patient_documents_type ON patient_documents(document_type);
```

### Supabase Storage Bucket
- Bucket name: `patient-documents`
- Path structure: `{patient_id}/{document_type}/{timestamp}_{filename}.pdf`
- RLS policies for authenticated users only

---

## 2. MODULAR COMPONENT STRUCTURE

### Reusable Form Sections (Already Built!)
```
src/features/forms/intake/steps/
├── Step1_PatientInformation/
│   ├── PersonalInfoSection.tsx
│   ├── ContactInfoSection.tsx
│   ├── DemographicsSection.tsx
│   └── EmergencyContactSection.tsx
├── Step2_MedicalInformation/
│   ├── DiagnosisSection.tsx
│   ├── PhysiciansSection.tsx
│   └── TreatmentHistorySectionNew.tsx
└── Step3_DisclosureAuthorization/
    └── DisclosureFormSection.tsx
```

### New: Patient Edit Container
```
src/features/patients/edit/
├── PatientEditContainer.tsx        # Main edit orchestrator
├── EditMode.ts                      # Type: 'full' | 'personal' | 'medical' | 'disclosure'
├── hooks/
│   ├── usePatientData.ts           # Fetch patient data
│   ├── usePatientUpdate.ts         # Update patient data
│   └── useFormPrepopulation.ts     # Transform DB data to form format
└── components/
    ├── EditModeSelector.tsx        # Choose what to edit
    ├── PatientEditForm.tsx         # Reuses intake sections
    └── EditHistory.tsx             # Show edit audit trail
```

### New: Document Management
```
src/features/patients/documents/
├── DocumentList.tsx                # List all patient documents
├── DocumentCard.tsx                # Single document with expiry indicator
├── DocumentUpload.tsx              # Upload new documents
├── DocumentViewer.tsx              # View/download PDF
├── DisclosureRenewal.tsx           # Renew expired disclosure form
└── hooks/
    ├── usePatientDocuments.ts      # Fetch documents
    ├── useDocumentUpload.ts        # Upload to Supabase Storage
    └── useDocumentExpiry.ts        # Check expiry status
```

---

## 3. DATA FLOW

### A. Saving PDF on Intake Submission
```
IntakeFormContainer (submit)
  ↓
pdfService.generatePDF(formData)
  ↓
documentService.uploadPDF(patientId, pdfBlob, 'disclosure_form')
  ↓
Supabase Storage.upload()
  ↓
patient_documents.insert({ file_path, expires_at: +1 year })
```

### B. Editing Patient Information
```
PatientProfile (click "Edit")
  ↓
PatientEditContainer (fetch patient data)
  ↓
usePatientData(patientId) → fetch from all tables
  ↓
useFormPrepopulation() → transform to form format
  ↓
Render intake sections with prepopulated data
  ↓
User edits → Submit
  ↓
usePatientUpdate() → update only changed fields
```

### C. Renewing Disclosure Form
```
DocumentCard (shows "Expired" badge)
  ↓
Click "Renew"
  ↓
DisclosureRenewal modal opens
  ↓
Prepopulate with existing patient data
  ↓
User updates signatures/dates
  ↓
Generate new PDF
  ↓
Upload to storage
  ↓
Create new patient_documents record
```

---

## 4. SERVICES

### documentService.ts
```typescript
interface DocumentService {
  uploadPDF(patientId: string, pdfBlob: Blob, documentType: string): Promise<string>;
  getPatientDocuments(patientId: string): Promise<Document[]>;
  downloadDocument(documentId: string): Promise<Blob>;
  deleteDocument(documentId: string): Promise<void>;
  checkExpiry(documentId: string): Promise<boolean>;
}
```

### patientEditService.ts
```typescript
interface PatientEditService {
  getFullPatientData(patientId: string): Promise<FullPatientData>;
  updatePatientInfo(patientId: string, updates: Partial<PatientData>): Promise<void>;
  updateMedicalInfo(patientId: string, updates: MedicalData): Promise<void>;
  updatePhysicians(patientId: string, physicians: Physician[]): Promise<void>;
  updateTreatmentHistory(patientId: string, treatments: TreatmentData): Promise<void>;
  getEditHistory(patientId: string): Promise<EditRecord[]>;
}
```

---

## 5. UI/UX FEATURES

### Patient Profile Page Enhancements
- **Documents Tab**: List all documents with expiry indicators
- **Edit Button**: Opens edit modal with mode selector
- **Expiry Alerts**: Red badge for expired documents
- **Quick Actions**: Renew disclosure, download PDF, edit info

### Edit Mode Selector
```
┌─────────────────────────────────────┐
│  What would you like to edit?      │
├─────────────────────────────────────┤
│  ○ Personal Information             │
│  ○ Medical Information              │
│  ○ Disclosure Form (Renew)          │
│  ○ Everything (Full Edit)           │
└─────────────────────────────────────┘
```

### Document Card with Expiry
```
┌─────────────────────────────────────┐
│ 📄 Disclosure Form                  │
│ Created: Dec 30, 2024               │
│ Expires: Dec 30, 2025  [⚠️ 30 days] │
│ [Download] [Renew] [Delete]         │
└─────────────────────────────────────┘
```

---

## 6. IMPLEMENTATION PHASES

### Phase 1: Document Storage (Sprint 5)
- Create patient_documents table
- Set up Supabase Storage bucket
- Implement documentService
- Save PDF on intake submission
- Basic document list view

### Phase 2: Document Management (Sprint 5)
- Document viewer/download
- Expiry tracking and alerts
- Disclosure form renewal workflow
- Delete documents

### Phase 3: Patient Editing (Sprint 6)
- Fetch and transform patient data
- Prepopulate form sections
- Edit mode selector
- Update services for partial updates
- Edit history/audit trail

### Phase 4: Polish & Testing (Sprint 6)
- Validation for edits
- Conflict resolution
- Permission checks
- Comprehensive testing

---

## 7. KEY PRINCIPLES

### Modularity
- ✅ Reuse ALL intake form sections
- ✅ Single source of truth for form fields
- ✅ Shared validation schemas
- ✅ Consistent styling and UX

### Data Integrity
- ✅ Audit trail for all edits
- ✅ Soft deletes for documents
- ✅ Version control for critical changes
- ✅ RLS policies for security

### User Experience
- ✅ Prepopulated forms (no retyping)
- ✅ Partial edits (don't force full form)
- ✅ Clear expiry indicators
- ✅ One-click renewal
- ✅ Instant PDF download

---

## 8. TECHNICAL NOTES

### Supabase Storage Setup
```typescript
// Create bucket
const { data, error } = await supabase.storage.createBucket('patient-documents', {
  public: false,
  fileSizeLimit: 10485760, // 10MB
  allowedMimeTypes: ['application/pdf']
});

// RLS Policy
CREATE POLICY "Authenticated users can access patient documents"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'patient-documents');
```

### Form Prepopulation Example
```typescript
const prepopulateForm = (patientData: FullPatientData): IntakeFormData => {
  return {
    patientData: {
      first_name: patientData.first_name,
      last_name: patientData.last_name,
      // ... map all fields
    },
    medicalData: {
      diagnosis_primary: patientData.diagnosis_primary,
      mercy_oncologists: patientData.physicians
        .filter(p => p.physician_type === 'mercy_oncologist')
        .map(p => ({ name: p.physician_name, location: p.physician_location, ... })),
      // ... map all fields
    },
    disclosureData: {
      // Fetch from disclosure_forms table
    }
  };
};
```

---

## NEXT STEPS

1. ✅ Fix custom physician location bug (add logging)
2. Create patient_documents migration
3. Set up Supabase Storage bucket
4. Implement documentService
5. Update intakeService to save PDF
6. Build document list component
7. Implement edit workflow
8. Test end-to-end

This architecture ensures maximum code reuse, maintainability, and scalability! 🚀
