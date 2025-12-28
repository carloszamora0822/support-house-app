# Sprint 5: Patient Intake Form (Part 2)

**Duration**: 1.5 weeks  
**Goal**: Build Steps 2, 3, 4 of multi-step intake form and complete submission flow

---

## 📋 Features

### 1. Step 2: Medical Information (Staff Use Only)
- **Diagnosis**: primary diagnosis, date, metastasis info
- **Oncologists**: Mercy checkboxes (Reddy, Mackey, Samman, Shrestha), Baptist checkboxes (Arzoumanian), Other text
- **Radiation Oncologists**: Mercy, Baptist, Other
- **Other Providers**: role, location, city, state
- **Surgeon**: name, location, city, state
- **General Doctor**: name, location, city, state
- **Treatment History**: surgery dates, chemo start/end (2 cycles), radiation start/end, other

### 2. Step 3: Authorization to Disclose (Fax Form)
- **Fax Header**: date, fax to office
- **Patient Info**: name, DOB, address, city, state, ZIP, phone (snapshot from Step 1)
- **Medical Office Staff Section**: diagnosis, stage, expected treatments, treatment dates
- **Chemo Details**: type (IV/Oral/Pump), frequency (daily/weekly/every/monthly)
- **Radiation Details**: frequency
- **Status Flags**: not in treatment, pending, terminal, ended
- **Signatures**: office staff signature/date, patient signature/date, printed name, rep relationship

### 3. Step 4: Review & Submit
- Display all entered data in organized sections
- Read-only view with edit buttons per section
- Edit button navigates back to specific step
- Final submit button
- Confirmation dialog before submit

### 4. Form Submission
- Create patient record
- Create initial visit record (intake type)
- Create emergency contact record
- Create minor children records
- Create disclosure form record
- All in single database transaction
- Rollback on any error

### 5. Post-Submission
- Success message with patient ID
- Option to print disclosure form (PDF)
- Redirect to Patient Summary
- Clear draft from localStorage

---

## 🎯 Inputs

### Step 2 Data Structure
```typescript
interface MedicalInformationInput {
  diagnosis_primary: string;
  diagnosis_date: Date;
  mets_to?: string;
  
  oncologist_mercy: string[];
  oncologist_baptist: string[];
  oncologist_other?: string;
  
  rad_oncologist_mercy?: string;
  rad_oncologist_baptist?: string;
  rad_oncologist_other?: string;
  
  provider_other_role?: string;
  provider_other_location?: string;
  provider_other_city?: string;
  provider_other_state?: string;
  
  surgeon_name?: string;
  surgeon_location?: string;
  surgeon_city?: string;
  surgeon_state?: string;
  
  general_doctor?: string;
  general_location?: string;
  general_city?: string;
  general_state?: string;
  
  treatment_surgery_dates?: string;
  treatment_chemo_start_1?: Date;
  treatment_chemo_end_1?: Date;
  treatment_chemo_start_2?: Date;
  treatment_chemo_end_2?: Date;
  treatment_radiation_start?: Date;
  treatment_radiation_end?: Date;
  treatment_other?: string;
}
```

### Step 3 Data Structure
```typescript
interface DisclosureAuthorizationInput {
  fax_form_date: Date;
  fax_to_office: string;
  
  // Patient info (auto-filled from Step 1)
  fax_patient_name: string;
  fax_patient_dob: Date;
  fax_patient_address: string;
  fax_patient_city: string;
  fax_patient_state: string;
  fax_patient_zip: string;
  fax_patient_phone: string;
  
  // Medical office staff section
  office_patient_diagnosis: string;
  office_stage?: string;
  office_expected_treatments?: number;
  office_treatment_start_date?: Date;
  office_treatment_end_date?: Date;
  
  office_chemo_type?: string[];
  office_chemo_frequency?: string;
  office_chemo_every_weeks?: number;
  
  office_radiation_frequency?: string;
  office_radiation_every_weeks?: number;
  
  office_status_flags?: string[];
  
  office_staff_signature: string;
  office_staff_signature_date: Date;
  
  fax_patient_signature: string;
  fax_patient_signature_date: Date;
  fax_patient_printed_name: string;
  fax_rep_relationship?: string;
}
```

---

## 📤 Outputs

### File Structure
```
src/
├── features/
│   └── forms/
│       ├── intake/
│       │   ├── steps/
│       │   │   ├── Step2_MedicalInformation.tsx + test
│       │   │   │   ├── DiagnosisSection.tsx + test
│       │   │   │   ├── OncologistSection.tsx + test
│       │   │   │   ├── RadiationOncologistSection.tsx + test
│       │   │   │   ├── ProviderDetailsSection.tsx + test
│       │   │   │   └── TreatmentHistorySection.tsx + test
│       │   │   ├── Step3_DisclosureAuthorization.tsx + test
│       │   │   │   ├── FaxHeaderSection.tsx + test
│       │   │   │   ├── PatientInfoSection.tsx + test
│       │   │   │   ├── MedicalOfficeSection.tsx + test
│       │   │   │   ├── ChemoDetailsSection.tsx + test
│       │   │   │   ├── RadiationDetailsSection.tsx + test
│       │   │   │   ├── PatientAgreementSection.tsx + test
│       │   │   │   └── SignaturesSection.tsx + test
│       │   │   └── Step4_ReviewSubmit.tsx + test
│       │   │       ├── ReviewSection.tsx + test
│       │   │       └── SubmitActions.tsx + test
│       │   ├── schemas/
│       │   │   ├── medicalSchema.ts + test
│       │   │   └── disclosureSchema.ts + test
│       │   └── hooks/
│       │       └── useFormSubmit.ts + test
│       └── services/
│           └── intakeService.ts + test
```

### Deliverables
1. Complete Step 2 (Medical Information)
2. Complete Step 3 (Disclosure Authorization)
3. Complete Step 4 (Review & Submit)
4. Form submission creates all records
5. Transaction rollback on error
6. Success flow with redirect
7. All components tested
8. All validation tested

---

## 📦 Dependencies & Imports

### New Packages
```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    "@react-pdf/renderer": "^3.1.14"
  }
}
```

### Import Examples
```typescript
// Step 2
import { DiagnosisSection } from './DiagnosisSection';
import { OncologistSection } from './OncologistSection';
import { medicalSchema } from '@/features/forms/intake/schemas/medicalSchema';
import { ONCOLOGISTS } from '@/constants/oncologists';

// Step 3
import { FaxHeaderSection } from './FaxHeaderSection';
import { MedicalOfficeSection } from './MedicalOfficeSection';
import { disclosureSchema } from '@/features/forms/intake/schemas/disclosureSchema';
import { TREATMENT_TYPES } from '@/constants/treatmentTypes';
import { FREQUENCIES } from '@/constants/frequencies';

// Step 4
import { ReviewSection } from './ReviewSection';
import { useFormSubmit } from '@/features/forms/intake/hooks/useFormSubmit';
import { intakeService } from '@/features/forms/services/intakeService';

// PDF generation
import { jsPDF } from 'jspdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
```

---

## 🎯 Expected Outcomes

### Functional Requirements
- [ ] Step 2 renders all medical fields
- [ ] Oncologist checkboxes work (multi-select)
- [ ] Treatment date fields validate correctly
- [ ] Can navigate back to Step 1
- [ ] Can advance to Step 3
- [ ] Step 3 auto-fills patient info from Step 1
- [ ] Chemo/radiation sections conditional on selection
- [ ] Can navigate back to Step 2
- [ ] Can advance to Step 4
- [ ] Step 4 displays all data from Steps 1-3
- [ ] Edit buttons navigate to correct step
- [ ] Submit button creates all records
- [ ] Transaction rolls back on error
- [ ] Success message shows patient ID
- [ ] Can print disclosure form PDF
- [ ] Redirects to Patient Summary
- [ ] Draft cleared after submission

### Technical Requirements
- [ ] All steps use Zod validation
- [ ] Form state persists across steps
- [ ] Database transaction ensures atomicity
- [ ] All records created with correct relationships
- [ ] Initial visit created with intake type
- [ ] All TypeScript types defined
- [ ] All tests passing
- [ ] No console errors

### Performance Requirements
- [ ] Step navigation instant
- [ ] Review page renders in < 500ms
- [ ] Submission completes in < 2 seconds
- [ ] PDF generation in < 1 second

---

## ✅ Definition of Done

### Code Quality
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for all steps
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used for all dropdowns

### Functionality
- [ ] All 3 steps render correctly
- [ ] All fields accept input
- [ ] Validation works for all fields
- [ ] Navigation works (back/next)
- [ ] Review displays all data
- [ ] Submission creates all records
- [ ] Transaction rollback works
- [ ] Success flow complete
- [ ] PDF generation works

### Testing
- [ ] medicalSchema.test.ts covers all validation
- [ ] disclosureSchema.test.ts covers all validation
- [ ] useFormSubmit.test.ts covers submission logic
- [ ] intakeService.test.ts covers database operations
- [ ] All section components tested
- [ ] Step4_ReviewSubmit.test.tsx covers display logic
- [ ] Tests verify transaction rollback
- [ ] Tests use mockPatients for data

### Database
- [ ] Transaction creates all records atomically
- [ ] Rollback tested and working
- [ ] Foreign keys set correctly
- [ ] Initial visit has intake type
- [ ] Patient visit_count starts at 1

### UI/UX
- [ ] All steps well-organized
- [ ] Progress indicator updates correctly
- [ ] Review page is scannable
- [ ] Edit buttons clear and functional
- [ ] Submit confirmation dialog clear
- [ ] Success message helpful
- [ ] PDF looks professional
- [ ] Mobile responsive

### Documentation
- [ ] Function comments added
- [ ] Transaction logic documented
- [ ] PDF generation documented
- [ ] Component props documented

### Git
- [ ] Committed with verbose commit messages
- [ ] Multiple commits (logical units)
- [ ] Branch: `feat/patient-intake-part2`
- [ ] No commented-out code
- [ ] No console.logs

---

## 🧪 Test Cases

### intakeService.test.ts
```typescript
describe('intakeService', () => {
  describe('submitIntakeForm', () => {
    it('creates patient record');
    it('creates initial visit record with intake type');
    it('creates emergency contact record');
    it('creates minor children records');
    it('creates disclosure form record');
    it('sets patient visit_count to 1');
    it('sets patient last_visit_date to today');
    it('returns created patient with ID');
    it('rolls back transaction on patient creation error');
    it('rolls back transaction on visit creation error');
    it('rolls back transaction on emergency contact error');
    it('rolls back transaction on minor children error');
    it('rolls back transaction on disclosure form error');
    it('throws error with helpful message on failure');
  });
});
```

### useFormSubmit.test.ts
```typescript
describe('useFormSubmit', () => {
  it('combines data from all steps');
  it('validates all steps before submission');
  it('sets isSubmitting true during submission');
  it('sets isSubmitting false after success');
  it('sets isSubmitting false after error');
  it('calls intakeService.submitIntakeForm with correct data');
  it('calls onSuccess callback with patient ID');
  it('sets error on submission failure');
  it('clears draft after successful submission');
});
```

### Step4_ReviewSubmit.test.tsx
```typescript
describe('Step4_ReviewSubmit', () => {
  it('displays patient identity data');
  it('displays contact info');
  it('displays demographics');
  it('displays insurance info');
  it('displays employment info');
  it('displays marital status');
  it('displays minor children');
  it('displays emergency contact');
  it('displays referral source');
  it('displays assistance types');
  it('displays medical diagnosis');
  it('displays oncologists');
  it('displays treatment history');
  it('displays disclosure form data');
  it('renders edit button for each section');
  it('navigates to Step 1 when Step 1 edit clicked');
  it('navigates to Step 2 when Step 2 edit clicked');
  it('navigates to Step 3 when Step 3 edit clicked');
  it('shows confirmation dialog on submit click');
  it('submits form when confirmed');
  it('does not submit when cancelled');
  it('shows loading state during submission');
  it('shows success message after submission');
  it('shows error message on submission failure');
});
```

---

## 📝 Implementation Order

### Days 1-2: Step 2 Sections
1. Write medicalSchema.test.ts
2. Implement medicalSchema.ts
3. Write DiagnosisSection.test.tsx
4. Implement DiagnosisSection
5. Write OncologistSection.test.tsx
6. Implement OncologistSection
7. Write RadiationOncologistSection.test.tsx
8. Implement RadiationOncologistSection
9. Write ProviderDetailsSection.test.tsx
10. Implement ProviderDetailsSection
11. Write TreatmentHistorySection.test.tsx
12. Implement TreatmentHistorySection

### Days 3-4: Step 2 Integration & Step 3 Sections
1. Write Step2_MedicalInformation.test.tsx
2. Implement Step2_MedicalInformation
3. Test Step 2 navigation
4. Write disclosureSchema.test.ts
5. Implement disclosureSchema.ts
6. Write FaxHeaderSection.test.tsx
7. Implement FaxHeaderSection
8. Write PatientInfoSection.test.tsx (auto-fill from Step 1)
9. Implement PatientInfoSection
10. Write MedicalOfficeSection.test.tsx
11. Implement MedicalOfficeSection

### Days 5-6: Step 3 Completion & Step 4
1. Write ChemoDetailsSection.test.tsx
2. Implement ChemoDetailsSection
3. Write RadiationDetailsSection.test.tsx
4. Implement RadiationDetailsSection
5. Write SignaturesSection.test.tsx
6. Implement SignaturesSection
7. Write Step3_DisclosureAuthorization.test.tsx
8. Implement Step3_DisclosureAuthorization
9. Test Step 3 navigation
10. Write ReviewSection.test.tsx
11. Implement ReviewSection

### Days 7-8: Submission Logic
1. Write intakeService.test.ts
2. Implement intakeService.ts (with transaction)
3. Test transaction rollback manually
4. Write useFormSubmit.test.ts
5. Implement useFormSubmit hook
6. Write SubmitActions.test.tsx
7. Implement SubmitActions
8. Write Step4_ReviewSubmit.test.tsx
9. Implement Step4_ReviewSubmit

### Days 9-10: PDF Generation & Integration
1. Create disclosure form PDF template
2. Implement PDF generation function
3. Test PDF output
4. Wire up full form flow (Steps 1-4)
5. Test navigation between all steps
6. Test edit buttons from review
7. Test full submission flow

### Day 11: Polish, Testing & Documentation
1. Manual testing of complete flow
2. Test all error scenarios
3. Test transaction rollback
4. Fix bugs
5. Ensure all tests pass
6. Code review and refactor
7. Update documentation
8. Demo to stakeholders

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Transaction rollback fails | Critical | Test thoroughly, add logging, manual verification |
| PDF generation slow/buggy | Medium | Use proven library, test with real data |
| Review page too long | Medium | Use collapsible sections, good visual hierarchy |
| Form state lost between steps | High | Persist to localStorage, test navigation thoroughly |

---

## 📊 Success Metrics

- All 3 steps (2, 3, 4) completed
- All 15+ section components created
- 100% of submissions create all records
- 100% of failed submissions rollback
- PDF generates successfully
- Test coverage ≥ 90%
- Zero TypeScript errors
- Zero ESLint warnings

---

## 🔗 Related Sprints

- **Previous**: Sprint 4 (Patient Intake Part 1) - provides Step 1
- **Next**: Sprint 6 (Analytics Dashboard) - uses patient data
- **Blocks**: Sprint 6 (needs patient data to analyze)
