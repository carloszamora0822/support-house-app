# Support House Application - Implementation Summary

## 🎯 What We're Building

A comprehensive patient management system for a cancer support house with:
1. **Patient Intake** - Multi-step form to register new patients
2. **Patient Lookup** - Fast search to find existing patients  
3. **Manual Check-In** - Track physical visits with timestamps
4. **Visit History** - Timeline of all patient interactions
5. **Analytics Dashboard** - Grant-driven reporting and insights

---

## 🏗️ Architecture Highlights

### **Two-Layer Data Model** (Critical!)
- **Patient-level**: Identity, demographics, medical info (changes rarely)
- **Visit-level**: Check-ins, assistance, notes (happens often)

This separation enables clean time-series analytics and accurate reporting.

### **Key Tables**
- `patients` - Main patient records with all v3 fields
- `visits` - Every physical visit with timestamp, staff, assistance
- `minor_children` - Children living in home
- `emergency_contacts` - Emergency contact info
- `disclosure_forms` - Medical disclosure/fax forms
- `users` - Staff authentication

### **Form Structure** (v3 fields + v2 UX)
**Step 1: Patient Information**
- Identity (name, DOB, "goes by", 3 phones, email, address)
- Demographics (status, ethnicity, language, education, insurance, veteran)
- Employment & marital status
- Minor children (dynamic list)
- Emergency contact
- Referral source & assistance types
- Certification & signatures

**Step 2: Medical Information** (Staff Use Only)
- Diagnosis & date
- Oncologists (Mercy, Baptist Health, Other)
- Radiation oncologists
- Provider details (surgeon, general doctor)
- Treatment history (surgery, chemo, radiation)

**Step 3: Authorization to Disclose** (Fax Form)
- Patient info snapshot
- Medical office staff section
- Treatment details (chemo/radiation frequency)
- Patient agreement & signatures

**Step 4: Review & Submit**
- Display all data for review
- Edit buttons to go back
- Final submit

---

## 🔄 Core User Flows

### **Returning Patient Check-In** (Most Common)
1. Staff searches patient by name
2. Patient Summary appears (shows all info + visit count)
3. Staff clicks "Check In This Patient"
4. Modal appears with assistance checkboxes
5. Staff confirms → Visit record created
6. Patient's `visit_count` increments, `last_visit_date` updates

### **New Patient Intake**
1. Staff clicks "New Patient"
2. Multi-step form (progress circles at top)
3. Conditional sections appear based on selections
4. Review screen shows everything
5. Submit → Creates patient + initial visit + disclosure form

---

## 📊 Analytics & Reporting

### **Automatically Tracked Metrics**
- Age distribution
- Visit counts per patient
- Days since last visit
- Visits per month
- Unique patients per month
- Repeat rate (patients with 2+ visits)
- Average visits per patient

### **Demographics Reporting**
- Ethnicity, language, education distribution
- Veteran status
- Insurance coverage
- Employment status
- Geographic distribution (city, county, state, ZIP)
- Minors in home (total, avg per household)

### **Assistance Utilization** (HIGH VALUE FOR GRANTS)
- Counts per type (wigs, food, medical supplies, etc.)
- Assistance per visit (average items per visit)
- Assistance per patient (average items per unique patient)
- Trends over time (monthly/quarterly)
- Most requested types

### **Operational Metrics**
- Check-ins per day
- Busiest days of week
- Staff productivity (check-ins per staff member)
- Average time in house (if check-out tracked)

---

## 🎨 Component Architecture

### **Atomic Design**
1. **Atoms** (`components/common/`) - Button, Input, Select, Checkbox, etc.
2. **Molecules** (`components/forms/`) - FormField, RadioGroup, ProgressIndicator
3. **Organisms** (`features/forms/*/steps/`) - PatientIdentitySection, DemographicsSection
4. **Templates** (`features/forms/*/`) - IntakeFormContainer, Step1_PatientInformation
5. **Pages** - IntakePage, SearchPage, DashboardPage

### **Key Principles**
- ✅ Zero hardcoded options (all in constants files)
- ✅ Reusable atoms across all forms
- ✅ Form-specific logic only in organisms
- ✅ TypeScript interfaces for everything
- ✅ Zod schemas for validation

---

## 🚀 MVP Implementation (8 Weeks)

### **Week 1-2: Foundation**
- Project setup (React + Vite + TypeScript + Supabase)
- Authentication
- Patient search + results
- Patient summary view
- Manual check-in modal
- Basic visit history

**Deliverable**: Staff can search and check in patients

### **Week 3-4: Patient Intake**
- Multi-step form (all 3 steps + review)
- Progress indicator
- Form validation
- Conditional sections
- Save draft functionality

**Deliverable**: Staff can register new patients

### **Week 5: Analytics**
- Dashboard with key metrics
- Charts (cancer types, assistance, demographics)
- Date range selectors

**Deliverable**: Real-time analytics for grants

### **Week 6: Reporting**
- CSV export
- Pre-built report templates
- Monthly/assistance/demographics reports

**Deliverable**: Exportable grant reports

### **Week 7: Edit & Disclosure**
- Edit patient info flow
- Change history tracking
- Disclosure form PDF generation

**Deliverable**: Update patients & manage forms

### **Week 8: Polish & Deploy**
- Testing, bug fixes
- Accessibility improvements
- Documentation
- Deployment to production

**Deliverable**: Production-ready app

---

## 🔑 Key Decisions

1. **Visits = Physical only** (not phone calls)
2. **Check-out optional** (MVP has check-in only)
3. **Track requested AND provided assistance**
4. **No quantities in MVP** (just yes/no checkboxes)
5. **Medical info editable** (snapshot at intake, updateable later)
6. **Duplicate detection in V1** (not MVP)
7. **3 roles**: Staff (full access), Admin (+ user mgmt), Viewer (read-only, future)

---

## 📁 Constants Files (NO HARDCODING!)

All dropdown options in dedicated files:
- `states.ts` - US states with regions
- `cancerTypes.ts` - All cancer types
- `ethnicities.ts` - Ethnicity options
- `languages.ts` - Language options
- `educationLevels.ts` - Education levels
- `assistanceTypes.ts` - Assistance types
- `oncologists.ts` - Mercy & Baptist Health oncologists
- `employmentStatuses.ts` - Employment options
- `maritalStatuses.ts` - Marital status options
- `insuranceTypes.ts` - Insurance types
- `referralSources.ts` - Referral sources
- `treatmentTypes.ts` - Chemo treatment types
- `frequencies.ts` - Treatment frequencies
- `formSteps.ts` - Step definitions

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State**: TanStack Query + Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deploy**: Netlify/Vercel + Supabase

---

## 📝 Next Steps

1. Review and approve architecture
2. Set up development environment
3. Create Supabase project
4. Initialize React project with structure
5. Create all constants files
6. Build database schema
7. Start Phase 1 implementation

---

## 📚 Documentation

- **ARCHITECTURE.md** - Complete technical architecture
- **FORM_COMPARISON.md** - v2 vs v3 field mapping (if needed)
- **API_CONTRACTS.md** - API endpoints (to be created)
- **USER_GUIDE.md** - Staff user guide (to be created)

---

**Ready to build!** 🚀
