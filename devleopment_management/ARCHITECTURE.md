# Support House Application - Architecture Documentation

## 🎯 Core Requirements

### **Primary Functions**
1. **Patient Intake** - New patient registration with multi-step form
2. **Patient Lookup** - Fast search to find existing patients
3. **Manual Check-In** - Track physical visits with timestamps
4. **Patient Summary** - View complete patient profile before actions
5. **Visit History** - Timeline of all patient interactions
6. **Analytics Dashboard** - Grant-driven reporting and insights

### **Technical Requirements**
- **Multi-step patient intake form** with progress indicator (circles that fill as you complete each step)
- **Complex conditional logic** from v2 (dynamic fields, required validation, popups)
- **Complete field set** from v3 (1:1 with physical form - 3 sections: Patient Info, Medical Info, Disclosure)
- **Authentication & role-based access** (admin, staff, viewer)
- **Two-layer data model** (Patient-level + Visit-level for clean reporting)
- **Comprehensive timestamping** (all creates, updates, visits)
- **Advanced reporting & insights** (demographics, assistance utilization, visit patterns)
- **Multiple form types** (intake, disclosure, follow-ups) - each can be multi-step
- **Review screen** before submission showing all entered data
- **Modular, maintainable, bloat-free codebase** with atomic components

---

## � Core Application Flows

### **A) Patient Intake (New Patient)**
**Purpose**: Register new patients with complete information

**Process**:
1. Staff initiates "New Patient" flow
2. Multi-step form (Patient Info → Medical Info → Disclosure)
3. System creates:
   - Patient record (identity, contact, demographics)
   - Initial visit record (timestamped)
   - Medical profile
   - Disclosure form (printable/fax-ready PDF)
4. Patient is now in system with visit_count = 1

**Outcome**: Complete patient profile ready for future check-ins

---

### **B) Patient Lookup (Search)**
**Purpose**: Find existing patients quickly

**Search Fields**:
- Name (first, last, "goes by")
- DOB
- Phone (any of 3 numbers)
- Email
- ZIP code

**Search Results Display**:
```
┌─────────────────────────────────────────────────────────┐
│ Jane Doe (goes by: Janey)                              │
│ DOB: 01/15/1975 (49 years) | Phone: (555) 123-4567    │
│ Fort Smith, AR 72901                                    │
│ Last Visit: Dec 15, 2024 | Total Visits: 12            │
│ [View Details]                                          │
├─────────────────────────────────────────────────────────┤
│ John Doe                                                │
│ DOB: 03/22/1980 (44 years) | Phone: (555) 987-6543    │
│ Rogers, AR 72756                                        │
│ Last Visit: Nov 3, 2024 | Total Visits: 3              │
│ [View Details]                                          │
└─────────────────────────────────────────────────────────┘
```

**Clicking Result**: Opens Patient Summary

---

### **C) Patient Summary (Read-First View)**
**Purpose**: Show complete patient info before taking action

**Display Sections**:

**Identity & Contact**
- Full name + DOB + current age
- "Goes by" nickname
- Phone (primary, second, other)
- Email
- Full address

**Demographics**
- Status (female/male/child)
- Ethnicity (multiple)
- Language (multiple)
- Education level
- Insurance (yes/no + types)
- Veteran status

**Household**
- Marital status + spouse info
- Caregiver info
- Minor children in home (count + details)

**Emergency Contact**
- Name, relationship, phone
- Address

**Guardian** (if child)
- Name, relationship

**Visit Information**
- Last visit date
- Total visit count
- Days since last visit
- Visit history link

**Flags** (optional alerts)
- ⚠️ Missing critical fields
- ⚠️ Disclosure form expired
- ⚠️ No recent visits (>6 months)

**Action Buttons**:
```
┌─────────────────────────────────────────────────────────┐
│  [✓ Check In This Patient]  (PRIMARY - BIG BUTTON)     │
├─────────────────────────────────────────────────────────┤
│  [Edit Patient Info]  [New Disclosure Form]             │
│  [View Visit History]  [View Medical Info]              │
└─────────────────────────────────────────────────────────┘
```

---

### **D) Manual Check-In (Physical Visit)**
**Purpose**: Record that patient physically visited today

**Flow**:
1. Staff searches patient → Patient Summary appears
2. Staff clicks **"Check In This Patient"**
3. Check-in modal appears:

```
┌─────────────────────────────────────────────────────────┐
│  Check In: Jane Doe                                     │
│  Last visited: Dec 15, 2024 (13 days ago)              │
├─────────────────────────────────────────────────────────┤
│  Assistance Requested Today: (optional)                 │
│  ☐ Wigs/Salon                                           │
│  ☐ Food                                                 │
│  ☐ Medical Supplies                                     │
│  ☐ Liquid Nutrition                                     │
│  ☐ Incontinence Supplies                                │
│  ☐ Clothing                                             │
│  ☐ Gas Card                                             │
│  ☐ Support Group                                        │
│  ☐ Other: [____________]                                │
├─────────────────────────────────────────────────────────┤
│  Notes: (optional)                                      │
│  [                                                    ]  │
│  [                                                    ]  │
├─────────────────────────────────────────────────────────┤
│  [Cancel]                    [Confirm Check-In]         │
└─────────────────────────────────────────────────────────┘
```

4. System creates Visit record with:
   - `check_in_timestamp` (now)
   - `staff_user_id` (who checked them in)
   - `assistance_requested` (array)
   - `notes` (optional)
   - `visit_type` = 'physical'

5. System updates Patient record:
   - `last_visit_date` = today
   - `visit_count` += 1

6. Success message: "✓ Jane Doe checked in successfully"

**Check-Out** (Optional Future):
- Add check-out button to mark `check_out_timestamp`
- Calculate time in house: `check_out - check_in`

---

### **E) Visit History**
**Purpose**: View timeline of all patient interactions

**Display**:
```
┌─────────────────────────────────────────────────────────┐
│  Visit History: Jane Doe (12 total visits)             │
├─────────────────────────────────────────────────────────┤
│  📅 Dec 28, 2024 - 10:30 AM                            │
│  Staff: Sarah Johnson                                   │
│  Assistance: Food, Gas Card                             │
│  Notes: Requested additional food assistance           │
│  [View Details]                                         │
├─────────────────────────────────────────────────────────┤
│  📅 Dec 15, 2024 - 2:15 PM                             │
│  Staff: Mike Davis                                      │
│  Assistance: Wigs/Salon                                 │
│  Notes: First wig fitting                               │
│  [View Details]                                         │
├─────────────────────────────────────────────────────────┤
│  📅 Nov 3, 2024 - 9:00 AM (INTAKE)                     │
│  Staff: Sarah Johnson                                   │
│  Assistance: Food, Medical Supplies                     │
│  Notes: New patient intake completed                    │
│  [View Details]                                         │
└─────────────────────────────────────────────────────────┘
```

---

## � Multi-Step Form Architecture

### **Form Flow Design**

Each form type (Intake, Disclosure, Follow-up) follows this pattern:

```
┌─────────────────────────────────────────────────────────┐
│  Progress Indicator (Circles: ○ ○ ○ ○ → ● ● ○ ○)       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Current Step Component]                               │
│  - Conditional fields from v2 UX                        │
│  - Complete field set from v3                           │
│  - Real-time validation                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Back] [Save Draft]              [Next / Review]       │
└─────────────────────────────────────────────────────────┘
```

### **Intake Form Steps** (Based on v3 structure)

**Step 1: Patient Information** (Section 1 from v3)
- Patient identity (name, DOB, goes by, address, city, state, zip, county)
- Contact info (email, 3 phone numbers)
- Demographics (status: female/male/child, ethnicity, language, education)
- Insurance & veteran status
- Employment & marital status
- Caregiver info
- Minor children in home (dynamic list)
- Emergency contact
- Referral source & assistance types
- Certification & signatures

**Step 2: Medical Information** (Section 2 from v3 - Staff Use Only)
- Primary diagnosis & date
- Metastasis info
- Oncologists (Mercy, Baptist Health, Other)
- Radiation oncologists
- Other providers (location, city, state)
- Surgeon info
- General doctor info
- Treatment history (surgery dates, chemo start/end, radiation start/end, other)

**Step 3: Authorization to Disclose** (Section 3 from v3 - Fax Form)
- Date & fax recipient
- Patient info (name, DOB, address, city, state, zip, phone)
- Medical office staff section (diagnosis, stage, expected treatments, dates)
- Chemo treatment details (IV/Oral/Pump, frequency)
- Radiation treatment details (frequency)
- Status flags (not in treatment, pending, terminal, ended)
- Office staff signature
- Patient agreement & signature

**Step 4: Review & Submit**
- Display all entered data in organized sections
- Edit buttons to go back to specific steps
- Final submit button

### **Component Hierarchy**

```
FormContainer (Parent)
├── ProgressIndicator
├── FormStepRouter
│   ├── Step1_PatientInformation
│   │   ├── PatientIdentitySection
│   │   ├── DemographicsSection
│   │   ├── InsuranceSection (conditional)
│   │   ├── EmploymentSection (conditional)
│   │   ├── MaritalStatusSection (conditional)
│   │   ├── MinorChildrenSection (dynamic list)
│   │   ├── EmergencyContactSection
│   │   ├── ReferralSection
│   │   └── CertificationSection
│   ├── Step2_MedicalInformation
│   │   ├── DiagnosisSection
│   │   ├── OncologistSection (checkboxes + other)
│   │   ├── RadiationOncologistSection
│   │   ├── ProviderDetailsSection
│   │   └── TreatmentHistorySection
│   ├── Step3_DisclosureAuthorization
│   │   ├── FaxHeaderSection
│   │   ├── PatientInfoSection
│   │   ├── MedicalOfficeSection (for staff)
│   │   ├── ChemoDetailsSection (conditional)
│   │   ├── RadiationDetailsSection (conditional)
│   │   ├── PatientAgreementSection
│   │   └── SignaturesSection
│   └── Step4_ReviewSubmit
│       ├── ReviewSection (read-only display)
│       └── SubmitActions
└── FormNavigation (Back, Save Draft, Next)
```

---

## 📊 Database Schema Design

### **Data Model Philosophy**

**Two-Layer Separation** (Critical for Clean Reporting):

1. **Patient-level** (changes rarely)
   - Identity, contact, demographics
   - Household, employment, insurance
   - Emergency contact, guardian
   - Medical diagnosis (snapshot at intake)

2. **Visit-level** (happens often)
   - Check-in/check-out timestamps
   - Staff member who processed
   - Assistance requested/provided
   - Visit-specific notes
   - Visit type (intake, returning, phone)

This separation enables:
- Clean time-series analytics
- Accurate visit counts
- Assistance utilization tracking
- Staff productivity metrics

---

### **Patients Table** (Main Entity - Based on v3)
```sql
patients (
  id: uuid PRIMARY KEY,
  created_at: timestamp,
  updated_at: timestamp,
  created_by: uuid (staff user),
  
  -- Identity (v3 fields)
  first_name: text,
  middle_name: text,
  last_name: text,
  goes_by: text,
  dob: date,
  age_at_intake: integer (computed),
  
  -- Contact
  email: text,
  phone_primary: text,
  phone_second: text,
  phone_other: text,
  
  -- Guardian (if status = child)
  guardian_name: text,
  guardian_relationship: text,
  
  -- Address
  address: text,
  city: text,
  county: text,
  state: text,
  zip: text,
  
  -- Demographics (v3: multiple selections possible)
  status: text, -- female, male, child
  ethnicity: text[], -- array: white, black, hispanic_latino, vietnamese, american_indian, other
  ethnicity_other: text,
  language: text[], -- array: english, spanish, vietnamese, laotian, other
  language_other: text,
  education: text, -- less_than_hs, ged, hs_grad, some_college, associate, bachelors, post_grad
  
  -- Insurance & Veteran
  has_insurance: boolean,
  insurance_type: text[], -- array: private, medicaid, medicare
  is_veteran: boolean,
  
  -- Employment
  employment_status: text, -- employed, retired, disabled, other
  employer_name: text,
  occupation: text,
  home_has_employed: boolean,
  
  -- Marital & Caregiver
  marital_status: text, -- married, single, widowed, separated, divorced
  spouse_name: text,
  spouse_cell: text,
  spouse_work: text,
  caregiver_name: text,
  caregiver_relation: text,
  caregiver_phone: text,
  
  -- Medical (v3 Section 2 - Staff Use Only)
  diagnosis_primary: text,
  diagnosis_date: date,
  mets_to: text,
  
  -- Oncologists
  oncologist_mercy: text[], -- array: reddy, mackey, samman, shrestha
  oncologist_baptist: text[], -- array: arzoumanian
  oncologist_other: text,
  
  -- Radiation Oncologists
  rad_oncologist_mercy: text,
  rad_oncologist_baptist: text,
  rad_oncologist_other: text,
  
  -- Other Providers
  provider_other_role: text,
  provider_other_location: text,
  provider_other_city: text,
  provider_other_state: text,
  
  surgeon_name: text,
  surgeon_location: text,
  surgeon_city: text,
  surgeon_state: text,
  
  general_doctor: text,
  general_location: text,
  general_city: text,
  general_state: text,
  
  -- Treatment History
  treatment_surgery_dates: text,
  treatment_chemo_start_1: date,
  treatment_chemo_end_1: date,
  treatment_chemo_start_2: date,
  treatment_chemo_end_2: date,
  treatment_radiation_start: date,
  treatment_radiation_end: date,
  treatment_other: text,
  
  -- Visits & Tracking
  initial_visit_date: date,
  time_in: time,
  time_out: time,
  file_updated_date: date,
  
  -- Referral
  referral_source: text, -- hospital_clinic_staff, friend_family, newspaper, clinic_gift_bags, other
  referral_other: text,
  
  -- Assistance Requested (v3)
  assistance_types: text[], -- wigs_salon, food, medical_supplies, liquid_nutrition, incontinence_supplies, clothing, other
  assistance_other: text,
  
  -- Certification (Patient Section)
  patient_signature: text,
  patient_printed_name: text,
  patient_signature_date: date,
  interviewed_by: text,
  interviewed_date: date,
  
  -- Visit Tracking (computed/updated)
  last_visit_date: date,
  visit_count: integer DEFAULT 0,
  days_since_last_visit: integer (computed),
  
  -- Status
  patient_status: text, -- active, inactive, deceased
  
  -- Timestamps (CRITICAL for analytics)
  created_at: timestamp DEFAULT NOW(),
  updated_at: timestamp DEFAULT NOW(),
  
  -- Indexes for common queries
  INDEX idx_diagnosis_primary (diagnosis_primary),
  INDEX idx_ethnicity (ethnicity),
  INDEX idx_state (state),
  INDEX idx_diagnosis_date (diagnosis_date),
  INDEX idx_patient_status (patient_status),
  INDEX idx_last_visit_date (last_visit_date),
  INDEX idx_created_at (created_at)
)
```

### **Visits Table** (One-to-Many - CRITICAL FOR ANALYTICS)
```sql
visits (
  id: uuid PRIMARY KEY,
  patient_id: uuid REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Visit Details
  visit_type: text, -- intake, returning, phone, other
  check_in_timestamp: timestamp NOT NULL,
  check_out_timestamp: timestamp,
  duration_minutes: integer (computed: check_out - check_in),
  
  -- Staff
  staff_user_id: uuid REFERENCES users(id),
  staff_name: text, -- denormalized for reporting
  
  -- Assistance (what they requested/received THIS visit)
  assistance_requested: text[], -- wigs_salon, food, medical_supplies, etc.
  assistance_provided: text[], -- what was actually given
  assistance_other: text,
  
  -- Notes
  visit_notes: text,
  
  -- Timestamps
  created_at: timestamp DEFAULT NOW(),
  
  -- Indexes for analytics
  INDEX idx_patient_id (patient_id),
  INDEX idx_check_in_timestamp (check_in_timestamp),
  INDEX idx_visit_type (visit_type),
  INDEX idx_staff_user_id (staff_user_id),
  INDEX idx_created_at (created_at)
)
```

**Trigger**: After insert on visits, update patients.last_visit_date and patients.visit_count

---

### **Minor Children Table** (One-to-Many - v3 structure)
```sql
minor_children (
  id: uuid PRIMARY KEY,
  patient_id: uuid REFERENCES patients(id) ON DELETE CASCADE,
  dob: date,
  sex: text, -- M or F
  name: text,
  created_at: timestamp,
  
  INDEX idx_patient_id (patient_id)
)
```

### **Emergency Contacts Table** (One-to-One - v3 structure)
```sql
emergency_contacts (
  id: uuid PRIMARY KEY,
  patient_id: uuid REFERENCES patients(id) ON DELETE CASCADE,
  name: text,
  relationship: text,
  address: text,
  city: text,
  state: text,
  zip: text,
  phone: text,
  created_at: timestamp
)
```

### **Disclosure Forms Table** (One-to-Many - v3 Section 3)
```sql
disclosure_forms (
  id: uuid PRIMARY KEY,
  patient_id: uuid REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Fax Header
  fax_form_date: date,
  fax_to_office: text,
  
  -- Patient Info (may duplicate patient table for form snapshot)
  fax_patient_name: text,
  fax_patient_dob: date,
  fax_patient_address: text,
  fax_patient_city: text,
  fax_patient_state: text,
  fax_patient_zip: text,
  fax_patient_phone: text,
  
  -- Medical Office Staff Section
  office_patient_diagnosis: text,
  office_stage: text,
  office_expected_treatments: integer,
  office_treatment_start_date: date,
  office_treatment_end_date: date,
  
  -- Chemo Treatment
  office_chemo_type: text[], -- iv, oral, pump_bag
  office_chemo_frequency: text, -- daily, weekly, every, monthly
  office_chemo_every_weeks: integer,
  
  -- Radiation Treatment
  office_radiation_frequency: text, -- daily, weekly, every, monthly
  office_radiation_every_weeks: integer,
  
  -- Status Flags
  office_status_flags: text[], -- not_in_treatment, treatment_pending, terminal_prognosis, treatment_ended
  
  -- Office Staff Signature
  office_staff_signature: text,
  office_staff_signature_date: date,
  
  -- Patient Signature
  fax_patient_signature: text,
  fax_patient_signature_date: date,
  fax_patient_printed_name: text,
  fax_rep_relationship: text,
  
  created_at: timestamp,
  created_by: uuid,
  
  INDEX idx_patient_id (patient_id),
  INDEX idx_created_at (created_at)
)
```

### **Form Submissions Table** (Audit Trail & Draft Storage)
```sql
form_submissions (
  id: uuid PRIMARY KEY,
  patient_id: uuid REFERENCES patients(id),
  form_type: text, -- intake, disclosure, follow_up
  status: text, -- draft, submitted, approved
  current_step: integer, -- for multi-step forms
  submitted_by: uuid, -- staff user
  submitted_at: timestamp,
  form_data: jsonb, -- full snapshot of all form data
  
  INDEX idx_form_type (form_type),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_patient_id (patient_id)
)
```

### **Users Table** (Authentication)
```sql
users (
  id: uuid PRIMARY KEY,
  email: text UNIQUE,
  role: text (admin, staff, viewer),
  full_name: text,
  created_at: timestamp,
  last_login: timestamp,
  is_active: boolean
)
```

---

## 📁 Project Structure

```
support-house-app/
├── public/
├── src/
│   ├── assets/              # Images, fonts, static files
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Atomic components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── DateInput.tsx
│   │   │   ├── TimeInput.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Alert.tsx
│   │   ├── forms/           # Form-specific molecules
│   │   │   ├── FormField.tsx         # Label + Input + Error
│   │   │   ├── FormSection.tsx       # Section wrapper with header
│   │   │   ├── FormGrid.tsx          # 12-column grid system
│   │   │   ├── ConditionalSection.tsx # Show/hide based on conditions
│   │   │   ├── DynamicList.tsx       # Add/remove items (minors, surgeries, chemo start end, radiation start end))
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── CheckboxGroup.tsx
│   │   │   ├── ProgressIndicator.tsx # Step circles
│   │   │   └── ReviewSection.tsx     # Read-only review display
│   │   └── layout/          # Header, Sidebar, Footer
│   ├── constants/           # 🔥 ALL CONSTANTS HERE - NO HARDCODING
│   │   ├── states.ts              # US states with regions
│   │   ├── cancerTypes.ts         # All cancer types (from v2)
│   │   ├── ethnicities.ts         # white, black, hispanic_latino, vietnamese, american_indian, other
│   │   ├── languages.ts           # english, spanish, vietnamese, laotian, other
│   │   ├── educationLevels.ts     # less_than_hs → post_grad
│   │   ├── assistanceTypes.ts     # wigs_salon, food, medical_supplies, etc.
│   │   ├── oncologists.ts         # Mercy & Baptist Health oncologists
│   │   ├── employmentStatuses.ts  # employed, retired, disabled, other
│   │   ├── maritalStatuses.ts     # married, single, widowed, separated, divorced
│   │   ├── insuranceTypes.ts      # private, medicaid, medicare
│   │   ├── referralSources.ts     # hospital_clinic_staff, friend_family, etc.
│   │   ├── treatmentTypes.ts      # iv, oral, pump_bag for chemo
│   │   ├── frequencies.ts         # daily, weekly, every, monthly
│   │   ├── formSteps.ts           # Step definitions for each form type
│   │   └── index.ts               # Re-export all constants
│   ├── features/            # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   └── types.ts
│   │   ├── forms/           # 🔥 MULTI-STEP FORM SYSTEM
│   │   │   ├── intake/      # Patient Intake Form (3 steps)
│   │   │   │   ├── IntakeFormContainer.tsx
│   │   │   │   ├── steps/
│   │   │   │   │   ├── Step1_PatientInformation.tsx
│   │   │   │   │   │   ├── PatientIdentitySection.tsx
│   │   │   │   │   │   ├── DemographicsSection.tsx
│   │   │   │   │   │   ├── InsuranceSection.tsx
│   │   │   │   │   │   ├── EmploymentSection.tsx
│   │   │   │   │   │   ├── MaritalStatusSection.tsx
│   │   │   │   │   │   ├── MinorChildrenSection.tsx
│   │   │   │   │   │   ├── EmergencyContactSection.tsx
│   │   │   │   │   │   ├── ReferralSection.tsx
│   │   │   │   │   │   └── CertificationSection.tsx
│   │   │   │   │   ├── Step2_MedicalInformation.tsx
│   │   │   │   │   │   ├── DiagnosisSection.tsx
│   │   │   │   │   │   ├── OncologistSection.tsx
│   │   │   │   │   │   ├── RadiationOncologistSection.tsx
│   │   │   │   │   │   ├── ProviderDetailsSection.tsx
│   │   │   │   │   │   └── TreatmentHistorySection.tsx
│   │   │   │   │   ├── Step3_DisclosureAuthorization.tsx
│   │   │   │   │   │   ├── FaxHeaderSection.tsx
│   │   │   │   │   │   ├── PatientInfoSection.tsx
│   │   │   │   │   │   ├── MedicalOfficeSection.tsx
│   │   │   │   │   │   ├── ChemoDetailsSection.tsx
│   │   │   │   │   │   ├── RadiationDetailsSection.tsx
│   │   │   │   │   │   ├── PatientAgreementSection.tsx
│   │   │   │   │   │   └── SignaturesSection.tsx
│   │   │   │   │   └── Step4_ReviewSubmit.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useIntakeForm.ts
│   │   │   │   │   └── useFormNavigation.ts
│   │   │   │   └── types.ts
│   │   │   ├── disclosure/  # Future: Standalone disclosure form
│   │   │   └── followup/    # Future: Follow-up forms
│   │   ├── lookup/          # 🔥 PATIENT SEARCH & LOOKUP
│   │   │   ├── components/
│   │   │   │   ├── PatientSearch.tsx
│   │   │   │   ├── SearchResults.tsx
│   │   │   │   └── SearchFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   └── usePatientSearch.ts
│   │   │   └── types.ts
│   │   ├── checkin/         # 🔥 MANUAL CHECK-IN SYSTEM
│   │   │   ├── components/
│   │   │   │   ├── CheckInModal.tsx
│   │   │   │   ├── AssistanceSelector.tsx
│   │   │   │   └── CheckInSuccess.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useCheckIn.ts
│   │   │   ├── services/
│   │   │   │   └── visitService.ts
│   │   │   └── types.ts
│   │   ├── patients/
│   │   │   ├── components/
│   │   │   │   ├── PatientSummary.tsx      # Main patient view
│   │   │   │   ├── PatientIdentityCard.tsx
│   │   │   │   ├── PatientDemographics.tsx
│   │   │   │   ├── PatientHousehold.tsx
│   │   │   │   ├── PatientEmergencyContact.tsx
│   │   │   │   ├── PatientVisitStats.tsx
│   │   │   │   ├── PatientFlags.tsx
│   │   │   │   ├── VisitHistory.tsx
│   │   │   │   ├── VisitCard.tsx
│   │   │   │   └── PatientActions.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePatient.ts
│   │   │   │   └── useVisitHistory.ts
│   │   │   ├── services/
│   │   │   │   └── patientService.ts
│   │   │   └── types.ts
│   │   ├── analytics/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── CancerTypeChart.tsx
│   │   │   │   ├── DemographicsChart.tsx
│   │   │   │   └── AssistanceReport.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAnalytics.ts
│   │   │   ├── services/
│   │   │   │   └── analyticsService.ts
│   │   │   └── types.ts
│   │   └── reports/
│   │       ├── components/
│   │       ├── services/
│   │       │   └── reportService.ts
│   │       └── types.ts
│   ├── hooks/               # Global custom hooks
│   │   ├── useAuth.ts
│   │   ├── useForm.ts
│   │   └── useDebounce.ts
│   ├── lib/                 # External library configs
│   │   ├── supabase.ts
│   │   └── queryClient.ts
│   ├── services/            # Core services
│   │   ├── api.ts           # Base API client
│   │   ├── storage.ts       # LocalStorage/SessionStorage
│   │   └── validation.ts    # Form validation
│   ├── types/               # Global TypeScript types
│   │   ├── database.ts
│   │   ├── forms.ts
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── formatters.ts
│   │   ├── calculations.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── supabase/                # Database migrations & functions
│   ├── migrations/
│   └── functions/
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔧 Services Architecture

### **Visit Service** (`features/checkin/services/visitService.ts`)
```typescript
// Check-in operations
- checkInPatient(patientId, data: { assistance, notes, staffUserId })
- checkOutPatient(visitId, checkOutTime)
- getActiveVisit(patientId) // Returns current visit if not checked out
- getVisitHistory(patientId, pagination)
- getVisitById(visitId)
- updateVisitNotes(visitId, notes)
- updateAssistanceProvided(visitId, assistance)

// Analytics
- getVisitsToday()
- getVisitsByDateRange(startDate, endDate)
- getVisitsByStaff(staffUserId, dateRange)
```

### **Patient Search Service** (`features/lookup/services/searchService.ts`)
```typescript
// Search operations
- searchPatients(query: { name?, dob?, phone?, email?, zip? })
- quickSearch(searchTerm) // Searches across all fields
- getRecentPatients(limit) // Last N patients accessed
- getSuggestedPatients(partialName) // Autocomplete
```

### **Form Service** (`features/forms/services/formService.ts`)
```typescript
// Multi-step form management
- saveDraft(formType, step, data)
- loadDraft(formType)
- clearDraft(formType)
- validateStep(formType, step, data)
- submitForm(formType, data)
- getFormProgress(formType)

// Form templates
- getFormSteps(formType) // Returns step configuration
- getStepSchema(formType, step) // Returns validation schema
```

### **Patient Service** (`features/patients/services/patientService.ts`)
```typescript
// CRUD operations
- createPatient(data)
- updatePatient(id, data)
- getPatient(id)
- listPatients(filters, pagination)
- deletePatient(id)
- searchPatients(query)

// Related entities
- addMinorChild(patientId, minorData)
- updateEmergencyContact(patientId, contactData)
- createDisclosureForm(patientId, disclosureData)
```

### **Analytics Service** (`features/analytics/services/analyticsService.ts`)
```typescript
// 🔥 COMPREHENSIVE ANALYTICS (Grant-Driven)

// Patient Demographics
- getCancerTypeDistribution()
- getDemographicBreakdown(field: 'ethnicity' | 'state' | 'education' | 'language')
- getAgeDistribution() // Buckets: 0-17, 18-30, 31-50, 51-65, 66+
- getVeteranStats()
- getInsuranceStats()
- getMinorsInHomeStats() // Total minors, avg per household, homes with minors
- getGeographicDistribution() // By city, county, state, zip

// Visit Analytics
- getTotalVisitsCount(dateRange)
- getUniquePatientCount(dateRange)
- getNewPatientsCount(dateRange)
- getReturningPatientsCount(dateRange) // visit_count >= 2
- getRepeatRate(dateRange) // % of patients with 2+ visits
- getAverageVisitsPerPatient(dateRange)
- getVisitsPerMonth(year)
- getVisitsPerDay(dateRange)
- getBusiestDays(dateRange) // Day of week analysis
- getAverageTimeBetweenVisits()
- getAverageTimeInHouse() // If check-out is tracked

// Assistance Utilization (HIGH VALUE FOR GRANTS)
- getAssistanceTypeStats(dateRange) // Count per type
- getAssistancePerVisit(dateRange) // Avg items per visit
- getAssistancePerPatient(dateRange) // Avg items per unique patient
- getAssistanceTrends(dateRange, interval) // Over time
- getMostRequestedAssistance(dateRange, limit)
- getAssistanceFulfillmentRate() // requested vs provided

// Staff Productivity
- getCheckInsByStaff(dateRange)
- getAverageCheckInsPerDay(staffId, dateRange)
- getStaffActivityLog(staffId, dateRange)

// Time-based Trends
- getNewPatientsOverTime(startDate, endDate, interval: 'day' | 'week' | 'month')
- getDiagnosisTrends(startDate, endDate)
- getTreatmentStats(startDate, endDate)
- getVisitTrends(startDate, endDate, interval)

// Operational Metrics
- getPatientsNotSeenInXDays(days) // Inactive patients
- getPatientsWithMissingFields() // Data quality
- getDisclosureFormStatus() // Expired, missing, current
- getAverageIntakeToFirstVisit() // Days between intake and return

// Custom Queries
- executeCustomQuery(queryConfig)
- generateGrantReport(grantType, dateRange)
```

### **Report Service** (`features/reports/services/reportService.ts`)
```typescript
// Pre-built reports
- generateMonthlyReport(month, year)
- generateCancerTypeReport(cancerType)
- generateDemographicReport(filters)
- generateAssistanceReport(startDate, endDate)

// Export functions
- exportToCSV(data, filename)
- exportToPDF(reportData, template)
- exportToExcel(data, filename)
```


---

## � Quantitative Fields & Metrics (Grant Reporting)

### **Automatically Derived Metrics**
| Metric | Calculation | Purpose |
|--------|-------------|---------|
| **Age** | `CURRENT_DATE - dob` | Age distribution analysis |
| **Visit Count** | Count of visit records per patient | Engagement tracking |
| **Days Since Last Visit** | `CURRENT_DATE - last_visit_date` | Retention analysis |
| **Visits Per Month** | Group visits by month | Trend analysis |
| **Unique Patients Per Month** | Distinct patient_id per month | Reach metrics |
| **Repeat Rate** | `(patients with visit_count >= 2) / total patients * 100` | Retention rate |
| **Average Visits Per Patient** | `total visits / unique patients` | Engagement depth |
| **Average Time Between Visits** | Avg days between consecutive visits | Visit frequency |
| **Average Time In House** | Avg `check_out - check_in` | Operational efficiency |

### **Directly Reportable Fields**

**Demographics** (from patients table):
- Ethnicity distribution (white, black, hispanic_latino, vietnamese, american_indian, other)
- Language distribution (english, spanish, vietnamese, laotian, other)
- Education levels (less_than_hs → post_grad)
- Veteran status (yes/no count)
- Insurance status (yes/no + type breakdown)
- Employment status (employed, retired, disabled, other)
- Marital status (married, single, widowed, separated, divorced)

**Geography** (from patients table):
- City distribution
- County distribution
- State distribution
- ZIP code distribution

**Household** (from minor_children table):
- Total minors in database
- Number of homes with minors
- Average minors per household
- Age distribution of minors

**Medical** (from patients table):
- Cancer type distribution
- Diagnosis date trends
- Metastasis rates
- Treatment type breakdown

**Assistance Utilization** (from visits table - HIGH VALUE):
- Counts per assistance type:
  - Wigs/Salon
  - Food
  - Medical Supplies
  - Liquid Nutrition
  - Incontinence Supplies
  - Clothing
  - Gas Card
  - Support Group
  - Other
- Assistance per visit (average items requested per visit)
- Assistance per patient (average items requested per unique patient)
- Most requested assistance types
- Assistance trends over time (monthly/quarterly)
- Fulfillment rate (requested vs provided)

**Operational Metrics**:
- Check-ins per day
- Busiest days of week
- Busiest times of day
- Staff productivity (check-ins per staff member)
- Average intake time (if tracking check-out)

### **Time-Series Tracking** (All Timestamped)
- `patients.created_at` - When patient entered system
- `patients.updated_at` - Last profile modification
- `visits.check_in_timestamp` - Physical visit start
- `visits.check_out_timestamp` - Physical visit end (optional)
- `visits.created_at` - Visit record creation
- `disclosure_forms.created_at` - Form generation time
- `form_submissions.submitted_at` - Form submission time

### **Audit Trail** (Who Did What When)
- `patients.created_by` - Staff who created patient
- `visits.staff_user_id` - Staff who checked in patient
- `disclosure_forms.created_by` - Staff who generated form
- `form_submissions.submitted_by` - Staff who submitted form

---

## � Key Analytics Queries

### **Query 1: Cancer Type Distribution**
```sql
SELECT 
  primary_cancer_type,
  COUNT(*) as patient_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM patients
WHERE status = 'active'
GROUP BY primary_cancer_type
ORDER BY patient_count DESC;
```

### **Query 2: Total Minors in Homes**
```sql
SELECT 
  COUNT(DISTINCT pm.patient_id) as homes_with_minors,
  COUNT(pm.id) as total_minors,
  ROUND(AVG(minor_count), 2) as avg_minors_per_home
FROM patient_minors pm
JOIN (
  SELECT patient_id, COUNT(*) as minor_count
  FROM patient_minors
  GROUP BY patient_id
) mc ON pm.patient_id = mc.patient_id;
```

### **Query 3: Assistance Type Breakdown**
```sql
SELECT 
  assistance_type,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) as fulfilled,
  COUNT(CASE WHEN status = 'requested' THEN 1 END) as pending,
  ROUND(COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) * 100.0 / COUNT(*), 2) as fulfillment_rate
FROM patient_assistance
GROUP BY assistance_type
ORDER BY total_requests DESC;
```

### **Query 4: Demographics Cross-Analysis**
```sql
SELECT 
  ethnicity,
  state,
  COUNT(*) as patient_count,
  COUNT(CASE WHEN has_insurance THEN 1 END) as insured_count,
  COUNT(CASE WHEN is_veteran THEN 1 END) as veteran_count
FROM patients
WHERE status = 'active'
GROUP BY ethnicity, state
ORDER BY patient_count DESC;
```

### **Query 5: Treatment Timeline Analysis**
```sql
SELECT 
  DATE_TRUNC('month', date_of_diagnosis) as diagnosis_month,
  COUNT(*) as new_diagnoses,
  COUNT(CASE WHEN started_chemo THEN 1 END) as started_chemo,
  COUNT(CASE WHEN started_radiation THEN 1 END) as started_radiation,
  COUNT(CASE WHEN EXISTS(
    SELECT 1 FROM patient_surgeries ps 
    WHERE ps.patient_id = patients.id
  ) THEN 1 END) as had_surgery
FROM patients
WHERE date_of_diagnosis >= NOW() - INTERVAL '12 months'
GROUP BY diagnosis_month
ORDER BY diagnosis_month DESC;
```

---

## 🎨 Component Modularity Strategy

### **Atomic Design Principles**

1. **Atoms** (`components/common/`)
   - Input, Button, Select, Checkbox, Radio, Label, Card, Badge, Alert
   - DateInput, TimeInput, TextArea
   - **Zero business logic** - pure presentation

2. **Molecules** (`components/forms/`)
   - FormField (Label + Input + Error + Hint)
   - RadioGroup, CheckboxGroup
   - ConditionalSection (show/hide wrapper)
   - DynamicList (add/remove items with template)
   - ProgressIndicator (step circles)
   - FormGrid (12-column responsive grid)
   - **Reusable across all forms** - no form-specific logic

3. **Organisms** (`features/forms/*/steps/`)
   - PatientIdentitySection (composed of FormFields)
   - DemographicsSection (composed of RadioGroups, CheckboxGroups)
   - MinorChildrenSection (uses DynamicList)
   - **Form-specific sections** - contains business logic & validation

4. **Templates** (`features/forms/*/`)
   - IntakeFormContainer (manages multi-step state)
   - Step1_PatientInformation (composes multiple sections)
   - **Orchestrates organisms** - handles navigation & data flow

5. **Pages** (top-level routes)
   - IntakePage, PatientsPage, AnalyticsPage, ReportsPage
   - **Route-level components** - minimal logic, mostly layout

### **Key Modularity Rules**

✅ **DO:**
- Keep atoms 100% reusable (no form-specific props)
- Use constants for all dropdown options
- Extract conditional logic into hooks
- Make sections independently testable
- Use TypeScript interfaces for all props

❌ **DON'T:**
- Hardcode options in components
- Mix presentation and business logic
- Create form-specific atoms
- Duplicate validation logic
- Skip prop type definitions

---

## 🔐 Authentication & Authorization

### **Roles**
- **Admin**: Full access (CRUD patients, manage users, view all reports)
- **Staff**: Create/edit patients, view reports, submit forms
- **Viewer**: Read-only access to patients and reports

### **Protected Routes**
```typescript
/login              → Public
/dashboard          → Authenticated
/patients           → Staff, Admin
/patients/new       → Staff, Admin
/patients/:id       → Staff, Admin
/patients/:id/edit  → Staff, Admin
/analytics          → All authenticated
/reports            → All authenticated
/admin/users        → Admin only
```

---

## 🖥️ Screen Flows & User Journeys

### **MVP Screens** (Fastest Usable Product)

1. **Login Screen**
   - Email + password
   - Role-based redirect (staff/admin)

2. **Dashboard/Home** (Landing after login)
   - Quick stats cards (today's check-ins, total patients, this month's visits)
   - Quick search bar
   - Recent patients list
   - Quick action buttons: "New Patient" | "Search Patient"

3. **Patient Search**
   - Search form (name, DOB, phone, email, ZIP)
   - Results list with key info
   - Click → Patient Summary

4. **Patient Summary** (Read-First View)
   - All patient info displayed
   - Big "Check In" button
   - Secondary actions (Edit, View History, New Disclosure)

5. **Check-In Modal**
   - Assistance checkboxes
   - Notes field
   - Confirm button

6. **New Patient Intake**
   - Multi-step form (3 steps + review)
   - Progress indicator
   - Save draft functionality

7. **Visit History**
   - Timeline of visits
   - Expandable details per visit

8. **Basic Analytics Dashboard**
   - Total patients
   - Total visits this month
   - Top assistance types
   - Simple charts

### **V1 Screens** (Next Phase)

9. **Edit Patient Info**
   - Same form as intake but pre-filled
   - Change history tracking

10. **Disclosure Form Workflow**
    - Generate printable PDF
    - Track status (created/faxed/returned)
    - View/download

11. **Reports Page**
    - Pre-built report templates
    - Date range selectors
    - Export to CSV/PDF

12. **Admin: User Management**
    - Add/edit/deactivate staff users
    - Role assignment

13. **Advanced Analytics**
    - Multiple chart types
    - Custom date ranges
    - Drill-down capabilities

### **User Journey: Returning Patient Check-In**
```
1. Staff logs in → Dashboard
2. Staff types patient name in search bar
3. Search results appear
4. Staff clicks patient → Patient Summary loads
5. Staff reviews info (last visit, emergency contact, etc.)
6. Staff clicks "Check In This Patient"
7. Check-in modal appears
8. Staff selects assistance types (optional)
9. Staff adds notes (optional)
10. Staff clicks "Confirm Check-In"
11. Success message appears
12. Patient Summary updates (visit count +1, last visit = today)
13. Staff can view updated visit history
```

### **User Journey: New Patient Intake**
```
1. Staff logs in → Dashboard
2. Staff clicks "New Patient"
3. Multi-step form begins
4. Step 1: Patient Information (staff fills out)
5. Click "Next" → Step 2: Medical Information
6. Click "Next" → Step 3: Disclosure Authorization
7. Click "Next" → Step 4: Review & Submit
8. Staff reviews all entered data
9. Staff clicks "Submit"
10. System creates patient + initial visit + disclosure form
11. Success message with patient ID
12. Option to print disclosure form
13. Redirect to Patient Summary
```

---

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: TanStack Query (React Query) + Zustand (global state)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts or Chart.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Netlify/Vercel (frontend) + Supabase (backend)

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.309.0"
  }
}
```

---

## 🎯 Implementation Phases

### **Phase 1: Foundation & MVP** (Week 1-2)
**Goal**: Get staff checking in patients

- Set up project structure (React + Vite + TypeScript)
- Create all constants files
- Set up Supabase database with schema (patients + visits tables)
- Implement authentication (login only)
- Build patient search + results
- Build patient summary view
- Build manual check-in modal
- Create basic visit history view

**Deliverable**: Staff can search patients and check them in

---

### **Phase 2: Patient Intake** (Week 3-4)
**Goal**: Add new patients to system

- Build multi-step intake form
  - Step 1: Patient Information (all v3 fields)
  - Step 2: Medical Information
  - Step 3: Disclosure Authorization
  - Step 4: Review & Submit
- Implement progress indicator
- Add form validation (Zod schemas)
- Implement save draft functionality
- Create minor children dynamic list
- Build conditional sections (guardian, insurance, employment, marital)

**Deliverable**: Staff can register new patients with complete info

---

### **Phase 3: Analytics Dashboard** (Week 5)
**Goal**: Provide grant-ready metrics

- Build analytics dashboard with key metrics:
  - Total patients
  - Visits this month
  - Cancer type distribution
  - Assistance utilization
  - Demographics breakdown
- Implement key analytics queries
- Create visualization components (charts)
- Add date range selectors

**Deliverable**: Staff/admin can view real-time metrics

---

### **Phase 4: Reporting & Export** (Week 6)
**Goal**: Generate grant reports

- Build report generation system
- Implement CSV export
- Implement PDF export (optional)
- Create pre-built report templates:
  - Monthly summary report
  - Assistance utilization report
  - Demographics report
  - Cancer type report

**Deliverable**: Admin can export data for grant applications

---

### **Phase 5: Edit & Disclosure** (Week 7)
**Goal**: Update patient info and manage disclosure forms

- Build edit patient info flow
- Add change history tracking
- Create disclosure form PDF generation
- Implement disclosure form status tracking
- Add "New Disclosure Form" workflow

**Deliverable**: Staff can update patient info and manage disclosure forms

---

### **Phase 6: Polish & Deploy** (Week 8)
**Goal**: Production-ready application

- Testing & bug fixes
- Performance optimization
- Accessibility improvements (WCAG 2.1 AA)
- Documentation (user guide + technical docs)
- Deployment to Netlify/Vercel + Supabase
- Staff training materials

**Deliverable**: Production-ready app with training docs

---

## 🔑 Key Product Decisions (Lock These Now)

### **1. What is a "visit"?**
**Decision**: In-person physical visits only
- Phone calls are NOT counted as visits
- Future: Can add "phone consultation" as separate visit_type

### **2. Check-out tracking?**
**Decision**: Optional for MVP, implement in V1
- MVP: Check-in only (timestamp when they arrive)
- V1: Add check-out button (calculate time in house)

### **3. Assistance tracking?**
**Decision**: Track both requested AND provided
- Check-in modal: "Assistance Requested Today" (what they ask for)
- Future: Staff can mark what was actually provided
- This enables fulfillment rate metrics

### **4. Assistance quantities?**
**Decision**: No quantities in MVP
- MVP: Just checkboxes (yes/no per type)
- V1: Add quantity fields (e.g., "3 gas cards")

### **5. Medical Info editability?**
**Decision**: Snapshot at intake, editable in Edit flow
- Intake: Captures medical info at that moment
- Edit Patient: Can update medical info
- Change history tracks all modifications

### **6. Duplicate detection?**
**Decision**: V1 feature
- MVP: No automatic duplicate detection
- V1: Warn if similar name + DOB exists during intake

### **7. Roles & Permissions?**
**Decision**: 3 roles
- **Staff**: Can do everything except user management
- **Admin**: Full access including user management
- **Viewer**: Read-only access (future, not MVP)

---

## 💡 Best Practices

1. **Constants**: Never hardcode options - always use constants files
2. **Types**: Define TypeScript interfaces for all data structures
3. **Validation**: Use Zod schemas for runtime validation
4. **Error Handling**: Centralized error handling with user-friendly messages
5. **Loading States**: Show loading indicators for all async operations
6. **Caching**: Use React Query for automatic caching and refetching
7. **Accessibility**: WCAG 2.1 AA compliance
8. **Performance**: Code splitting, lazy loading, memoization
9. **Testing**: Unit tests for services, integration tests for features

---

## 🔍 Future Enhancements

- Multi-language support (i18n)
- Advanced search with filters
- Bulk import/export
- Email notifications
- Document upload (medical records)
- Appointment scheduling
- Patient portal (self-service)
- Mobile app (React Native)
