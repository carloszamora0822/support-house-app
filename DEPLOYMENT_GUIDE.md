# Deployment Guide - Support House App

## 🚀 Quick Deployment Steps

### 1. Apply Database Migration

**IMPORTANT:** Run this SQL in your Supabase SQL Editor before deploying:

Go to: https://zwcpoqeimpabivktyagy.supabase.co/project/zwcpoqeimpabivktyagy/sql

```sql
-- Migration to align database schema with UI form fields
-- This ensures all form fields from IntakeFormContainer can be saved

-- Add missing columns to patients table
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS middle_name TEXT,
  ADD COLUMN IF NOT EXISTS goes_by TEXT,
  ADD COLUMN IF NOT EXISTS county TEXT,
  ADD COLUMN IF NOT EXISTS ethnicity_other TEXT,
  ADD COLUMN IF NOT EXISTS language_other TEXT,
  ADD COLUMN IF NOT EXISTS spouse_cell TEXT,
  ADD COLUMN IF NOT EXISTS spouse_work TEXT,
  ADD COLUMN IF NOT EXISTS assistance_other TEXT,
  ADD COLUMN IF NOT EXISTS referral_other TEXT,
  ADD COLUMN IF NOT EXISTS patient_printed_name TEXT,
  ADD COLUMN IF NOT EXISTS interviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS interviewed_date DATE;

-- Ensure all array columns exist
DO $$ 
BEGIN
  -- Check and add ethnicity if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'ethnicity'
  ) THEN
    ALTER TABLE patients ADD COLUMN ethnicity TEXT[];
  END IF;

  -- Check and add language if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'language'
  ) THEN
    ALTER TABLE patients ADD COLUMN language TEXT[];
  END IF;

  -- Check and add insurance_type if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'insurance_type'
  ) THEN
    ALTER TABLE patients ADD COLUMN insurance_type TEXT[];
  END IF;

  -- Check and add assistance_types if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'assistance_types'
  ) THEN
    ALTER TABLE patients ADD COLUMN assistance_types TEXT[];
  END IF;

  -- Check and add oncologist_mercy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'oncologist_mercy'
  ) THEN
    ALTER TABLE patients ADD COLUMN oncologist_mercy TEXT[];
  END IF;

  -- Check and add oncologist_baptist if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'oncologist_baptist'
  ) THEN
    ALTER TABLE patients ADD COLUMN oncologist_baptist TEXT[];
  END IF;
END $$;

-- Add indexes for new searchable fields
CREATE INDEX IF NOT EXISTS idx_patients_county ON patients(county);
CREATE INDEX IF NOT EXISTS idx_patients_goes_by ON patients(goes_by);
CREATE INDEX IF NOT EXISTS idx_patients_interviewed_date ON patients(interviewed_date);

-- Add comment for documentation
COMMENT ON TABLE patients IS 'Main patient records table - aligned with intake form UI fields';
```

### 2. Build the Application

```bash
npm run build:prod
```

This will create an optimized production build in the `dist/` folder without test files.

### 3. Deploy to Vercel (Recommended)

#### Option A: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set build command: `npm run build:prod`
4. Set output directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`: https://zwcpoqeimpabivktyagy.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: [your anon key]

### 4. Alternative: Netlify

```bash
# Build locally
npm run build:prod

# Deploy to Netlify
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

Or use Netlify's drag-and-drop interface with the `dist/` folder.

---

## ✅ What's Been Completed

### Database Schema
- ✅ All patient fields aligned with UI
- ✅ Emergency contacts table
- ✅ Minor children table
- ✅ Disclosure forms table
- ✅ Visits tracking
- ✅ Row Level Security (RLS) policies

### Frontend Features
- ✅ Multi-step intake form (4 steps)
- ✅ Patient Information section with all fields
- ✅ Medical Information section
- ✅ Disclosure Authorization section
- ✅ Review & Submit section
- ✅ Form validation with Zod schemas
- ✅ Auto-fill patient info in disclosure form
- ✅ Progress indicator
- ✅ Error handling with toast notifications
- ✅ Controlled input components (no React warnings)

### Backend Integration
- ✅ Complete `intakeService` with all field mappings
- ✅ Patient record creation
- ✅ Initial visit record creation
- ✅ Emergency contact creation
- ✅ Minor children records creation
- ✅ Disclosure form creation
- ✅ Success/error handling
- ✅ Navigation after submission

---

## 🐛 Known Issues & Fixes

### Issue: Controlled Input Warning
**Status:** ✅ FIXED

Fixed in:
- `src/components/common/Checkbox.tsx` - Added default `checked ?? false`
- `src/components/forms/CheckboxGroup.tsx` - Added default empty array for value prop

### Issue: Database Schema Mismatch
**Status:** ✅ FIXED

Migration created: `supabase/migrations/016_align_schema_with_ui.sql`
**Action Required:** Run SQL in Supabase dashboard (see step 1 above)

---

## 📋 Testing Checklist

Before deploying, test these flows:

- [ ] Login with staff credentials
- [ ] Navigate to intake form
- [ ] Fill out Step 1 (Patient Information)
- [ ] Fill out Step 2 (Medical Information)
- [ ] Fill out Step 3 (Disclosure Authorization)
- [ ] Review all information in Step 4
- [ ] Submit form successfully
- [ ] Verify patient appears in dashboard
- [ ] Check database records created correctly

---

## 🔒 Security Headers

Security headers are configured in `vite.config.ts`:
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Content-Security-Policy configured
- ✅ Permissions-Policy set

---

## 📝 Environment Variables Required

```env
VITE_SUPABASE_URL=https://zwcpoqeimpabivktyagy.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🎯 Next Steps (Future Enhancements)

1. **Analytics Dashboard** - Add AI-powered analytics agent
2. **PDF Export** - Export patient intake forms as PDF (jspdf already installed)
3. **Audit Logging** - Track all form submissions and changes
4. **Advanced Search** - Full-text search across patient records
5. **Reports** - Generate monthly/quarterly reports
6. **Notifications** - Email notifications for new patients

---

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify database migration was applied
3. Check Supabase logs for backend errors
4. Review `HIPAA_COMPLIANCE.md` for security requirements
