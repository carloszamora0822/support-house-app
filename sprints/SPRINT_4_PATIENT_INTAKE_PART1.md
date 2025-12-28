# Sprint 4: Patient Intake Form (Part 1)

**Duration**: 1.5 weeks  
**Goal**: Build Step 1 (Patient Information) of multi-step intake form

---

## 📋 Features

### 1. Intake Form Container
- Multi-step form wrapper
- Progress indicator (circles: ○ ○ ○ ○ → ● ○ ○ ○)
- Step navigation (Back, Next, Save Draft)
- Form state management
- Draft auto-save to localStorage
- Step validation before advancing

### 2. Step 1: Patient Information
All sections from v3 template:
- **Patient Identity**: name, DOB, goes by, address, city, state, ZIP, county
- **Contact Info**: email, 3 phone numbers
- **Demographics**: status (female/male/child), ethnicity (multi-select), language (multi-select), education
- **Guardian Info**: conditional (shows if status = child)
- **Insurance**: has insurance checkbox, insurance types (multi-select), veteran status
- **Employment**: status, employer, occupation, home has employed
- **Marital Status**: conditional spouse info
- **Caregiver**: name, relation, phone
- **Minor Children**: dynamic list (add/remove rows)
- **Emergency Contact**: name, relationship, address, phone
- **Referral**: source, other text
- **Assistance Types**: multi-select checkboxes
- **Certification**: patient signature, printed name, date, interviewed by

### 3. Form Components (Molecules)
- FormField (label + input + error + hint)
- ConditionalSection (show/hide based on conditions)
- DynamicList (add/remove items)
- RadioGroup, CheckboxGroup
- ProgressIndicator

### 4. Validation
- Zod schemas for all fields
- Required field validation
- Email format validation
- Phone format validation
- ZIP code format validation
- DOB validation (not in future, valid date)
- Conditional validation (guardian required if child)

### 5. Draft Management
- Auto-save every 30 seconds
- Save draft button
- Load draft on page load
- Clear draft after submission

---

## 🎯 Inputs

### Form Data Structure
```typescript
interface PatientInformationInput {
  // Identity
  first_name: string;
  middle_name?: string;
  last_name: string;
  goes_by?: string;
  dob: Date;
  
  // Contact
  email?: string;
  phone_primary: string;
  phone_second?: string;
  phone_other?: string;
  
  // Address
  address: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  
  // Demographics
  status: 'female' | 'male' | 'child';
  ethnicity: string[];
  ethnicity_other?: string;
  language: string[];
  language_other?: string;
  education?: string;
  
  // Guardian (conditional)
  guardian_name?: string;
  guardian_relationship?: string;
  
  // Insurance
  has_insurance: boolean;
  insurance_type?: string[];
  is_veteran: boolean;
  
  // Employment
  employment_status?: string;
  employer_name?: string;
  occupation?: string;
  home_has_employed?: boolean;
  
  // Marital
  marital_status?: string;
  spouse_name?: string;
  spouse_cell?: string;
  spouse_work?: string;
  
  // Caregiver
  caregiver_name?: string;
  caregiver_relation?: string;
  caregiver_phone?: string;
  
  // Minor children
  minor_children: Array<{
    dob: Date;
    sex: 'M' | 'F';
    name?: string;
  }>;
  
  // Emergency contact
  emergency_contact: {
    name: string;
    relationship: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  
  // Referral
  referral_source: string;
  referral_other?: string;
  
  // Assistance
  assistance_types: string[];
  assistance_other?: string;
  
  // Certification
  patient_signature: string;
  patient_printed_name: string;
  patient_signature_date: Date;
  interviewed_by: string;
  interviewed_date: Date;
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
│       │   ├── IntakeFormContainer.tsx + IntakeFormContainer.test.tsx
│       │   ├── steps/
│       │   │   └── Step1_PatientInformation.tsx + Step1_PatientInformation.test.tsx
│       │   │       ├── PatientIdentitySection.tsx + PatientIdentitySection.test.tsx
│       │   │       ├── DemographicsSection.tsx + DemographicsSection.test.tsx
│       │   │       ├── InsuranceSection.tsx + InsuranceSection.test.tsx
│       │   │       ├── EmploymentSection.tsx + EmploymentSection.test.tsx
│       │   │       ├── MaritalStatusSection.tsx + MaritalStatusSection.test.tsx
│       │   │       ├── MinorChildrenSection.tsx + MinorChildrenSection.test.tsx
│       │   │       ├── EmergencyContactSection.tsx + EmergencyContactSection.test.tsx
│       │   │       ├── ReferralSection.tsx + ReferralSection.test.tsx
│       │   │       └── CertificationSection.tsx + CertificationSection.test.tsx
│       │   ├── hooks/
│       │   │   ├── useIntakeForm.ts + useIntakeForm.test.ts
│       │   │   └── useFormNavigation.ts + useFormNavigation.test.ts
│       │   ├── schemas/
│       │   │   └── patientSchema.ts + patientSchema.test.ts
│       │   └── types.ts
│       └── services/
│           └── formService.ts + formService.test.ts
├── components/
│   └── forms/
│       ├── FormField.tsx + FormField.test.tsx
│       ├── FormSection.tsx + FormSection.test.tsx
│       ├── FormGrid.tsx + FormGrid.test.tsx
│       ├── ConditionalSection.tsx + ConditionalSection.test.tsx
│       ├── DynamicList.tsx + DynamicList.test.tsx
│       ├── RadioGroup.tsx + RadioGroup.test.tsx
│       ├── CheckboxGroup.tsx + CheckboxGroup.test.tsx
│       └── ProgressIndicator.tsx + ProgressIndicator.test.tsx
```

### Deliverables
1. Working multi-step form container
2. Complete Step 1 with all sections
3. Progress indicator showing current step
4. Form validation with Zod
5. Conditional sections (guardian, spouse)
6. Dynamic minor children list
7. Draft save/load functionality
8. All components tested
9. All validation tested

---

## 📦 Dependencies & Imports

### Import Examples
```typescript
// Form container
import { useIntakeForm } from '@/features/forms/intake/hooks/useIntakeForm';
import { useFormNavigation } from '@/features/forms/intake/hooks/useFormNavigation';
import { ProgressIndicator } from '@/components/forms/ProgressIndicator';

// Step 1
import { PatientIdentitySection } from './PatientIdentitySection';
import { DemographicsSection } from './DemographicsSection';
import { patientSchema } from '@/features/forms/intake/schemas/patientSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form components
import { FormField } from '@/components/forms/FormField';
import { ConditionalSection } from '@/components/forms/ConditionalSection';
import { DynamicList } from '@/components/forms/DynamicList';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';

// Constants
import { STATES } from '@/constants/states';
import { ETHNICITIES } from '@/constants/ethnicities';
import { LANGUAGES } from '@/constants/languages';
import { EDUCATION_LEVELS } from '@/constants/educationLevels';
import { ASSISTANCE_TYPES } from '@/constants/assistanceTypes';
```

---

## 🎯 Expected Outcomes

### Functional Requirements
- [ ] User can start new patient intake
- [ ] Progress indicator shows Step 1 active
- [ ] All form fields render correctly
- [ ] Guardian section shows only if status = child
- [ ] Spouse section shows only if marital_status = married
- [ ] Can add/remove minor children rows
- [ ] All dropdowns use constants (no hardcoded values)
- [ ] Form validates on Next click
- [ ] Cannot advance to Step 2 with validation errors
- [ ] Draft auto-saves every 30 seconds
- [ ] Can manually save draft
- [ ] Draft loads on page refresh
- [ ] Validation errors show clearly

### Technical Requirements
- [ ] Zod schema validates all fields
- [ ] React Hook Form manages form state
- [ ] Conditional rendering based on field values
- [ ] Dynamic list adds/removes items correctly
- [ ] localStorage used for draft storage
- [ ] All TypeScript types defined
- [ ] All tests passing
- [ ] No console errors

### Performance Requirements
- [ ] Form renders in < 500ms
- [ ] Field updates feel instant
- [ ] Draft save doesn't block UI
- [ ] Validation runs in < 100ms

---

## ✅ Definition of Done

### Code Quality
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for intake form
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used for all dropdowns

### Functionality
- [ ] All sections render correctly
- [ ] All fields accept input
- [ ] Validation works for all fields
- [ ] Conditional sections show/hide correctly
- [ ] Dynamic list works (add/remove)
- [ ] Draft save/load works
- [ ] Progress indicator updates
- [ ] Can navigate to Step 2 (placeholder)

### Testing
- [ ] patientSchema.test.ts covers all validation rules
- [ ] useIntakeForm.test.ts covers form state management
- [ ] useFormNavigation.test.ts covers step navigation
- [ ] All section components tested
- [ ] ConditionalSection.test.tsx covers show/hide logic
- [ ] DynamicList.test.tsx covers add/remove
- [ ] FormField.test.tsx covers label/input/error display
- [ ] Tests use mockPatients for initial values

### UI/UX
- [ ] Form is well-organized and scannable
- [ ] Labels are clear
- [ ] Required fields marked with *
- [ ] Error messages are helpful
- [ ] Progress indicator is clear
- [ ] Navigation buttons are obvious
- [ ] Mobile responsive (basic)

### Documentation
- [ ] Function comments added
- [ ] Validation rules documented
- [ ] Conditional logic explained
- [ ] Component props documented

### Git
- [ ] Committed with verbose commit messages
- [ ] Multiple commits (logical units)
- [ ] Branch: `feat/patient-intake-part1`
- [ ] No commented-out code
- [ ] No console.logs

---

## 📝 Implementation Order

### Days 1-2: Form Foundation
1. Write patientSchema.test.ts
2. Implement patientSchema.ts
3. Write useIntakeForm.test.ts
4. Implement useIntakeForm hook
5. Write useFormNavigation.test.ts
6. Implement useFormNavigation hook
7. Write formService.test.ts (draft save/load)
8. Implement formService.ts

### Days 3-4: Form Components (Molecules)
1. Write FormField.test.tsx
2. Implement FormField
3. Write FormSection.test.tsx
4. Implement FormSection
5. Write ConditionalSection.test.tsx
6. Implement ConditionalSection
7. Write DynamicList.test.tsx
8. Implement DynamicList
9. Write ProgressIndicator.test.tsx
10. Implement ProgressIndicator

### Days 5-7: Step 1 Sections (Part 1)
1. Write PatientIdentitySection.test.tsx
2. Implement PatientIdentitySection
3. Write DemographicsSection.test.tsx
4. Implement DemographicsSection
5. Write InsuranceSection.test.tsx
6. Implement InsuranceSection
7. Write EmploymentSection.test.tsx
8. Implement EmploymentSection
9. Write MaritalStatusSection.test.tsx
10. Implement MaritalStatusSection

### Days 8-9: Step 1 Sections (Part 2)
1. Write MinorChildrenSection.test.tsx
2. Implement MinorChildrenSection
3. Write EmergencyContactSection.test.tsx
4. Implement EmergencyContactSection
5. Write ReferralSection.test.tsx
6. Implement ReferralSection
7. Write CertificationSection.test.tsx
8. Implement CertificationSection

### Day 10: Integration & Container
1. Write Step1_PatientInformation.test.tsx
2. Implement Step1_PatientInformation (compose all sections)
3. Write IntakeFormContainer.test.tsx
4. Implement IntakeFormContainer
5. Wire up navigation
6. Test full Step 1 flow

### Day 11: Polish, Testing & Documentation
1. Manual testing of all fields
2. Test conditional sections
3. Test dynamic list
4. Test draft save/load
5. Fix bugs
6. Ensure all tests pass
7. Code review and refactor
8. Update documentation

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Form too complex, overwhelming | High | Break into clear sections, use progressive disclosure |
| Validation schema too strict | Medium | Test with real data, adjust rules as needed |
| Dynamic list UX confusing | Medium | Clear add/remove buttons, good visual feedback |
| Draft storage exceeds localStorage limit | Low | Compress data, warn user if too large |

---

## 📊 Success Metrics

- All 9 sections of Step 1 completed
- All 8 form molecule components created
- 100% of fields validated correctly
- Draft save/load works 100% of time
- Test coverage ≥ 90%
- Zero TypeScript errors
- Zero ESLint warnings

---

## 🔗 Related Sprints

- **Previous**: Sprint 3 (Manual Check-In) - provides form patterns
- **Next**: Sprint 5 (Patient Intake Part 2) - Steps 2, 3, 4
- **Blocks**: Sprint 5 (needs Step 1 complete)
