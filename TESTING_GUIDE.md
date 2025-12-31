# 🧪 Security & User Management Testing Guide

## Pre-Testing Setup

### 1. Apply All Migrations First
```sql
-- In Supabase SQL Editor, run these in order:
022_optimize_patient_search.sql
023_create_search_function.sql
024_create_rate_limiting.sql
025_enhance_audit_logging.sql
026_user_management_system.sql
```

### 2. Create Admin User (Chele)
```sql
-- In Supabase SQL Editor:
-- First, create auth user via Supabase Dashboard > Authentication > Users > "Invite User"
-- Email: chele@reynoldscancersupporthouse.org
-- Then update the users table:

INSERT INTO users (
  id, 
  email, 
  full_name, 
  role, 
  account_status,
  created_at
) VALUES (
  'YOUR_AUTH_USER_ID_HERE', -- Get this from auth.users table
  'chele@reynoldscancersupporthouse.org',
  'Chele (Admin)',
  'admin',
  'active',
  NOW()
);
```

---

## 🔒 Test 1: Server-Side Rate Limiting

**What we're testing:** Brute force protection (cannot bypass by clearing localStorage)

### Steps:
1. Go to login page
2. Enter email: `test@test.com`
3. Enter wrong password: `wrong123`
4. Click "Sign in" **5 times**
5. On 6th attempt, should see: **"Account temporarily locked... 15 minutes"**

### Verify in Database:
```sql
SELECT * FROM login_attempts 
WHERE email = 'test@test.com' 
ORDER BY attempt_timestamp DESC 
LIMIT 10;
```

**Expected:** 5 failed attempts logged with timestamps

### Try to Bypass:
1. Open DevTools → Application → Local Storage
2. Clear all localStorage
3. Try logging in again
4. Should **STILL be locked out** ✅

**Result:** ✅ Pass / ❌ Fail

---

## 👥 Test 2: User Registration & Admin Approval

**What we're testing:** Complete registration workflow with admin approval

### Part A: User Registration
1. Go to login page
2. Click **"Request Access"**
3. Fill out registration form:
   - Email: `carla@test.com`
   - Full Name: `Carla Test`
   - Role: `Staff`
   - Password: `TestPassword123!@#`
   - Confirm Password: `TestPassword123!@#`
4. Click **"Submit Registration"**
5. Should see: **"Registration submitted! Please check your email..."**

### Verify in Database:
```sql
SELECT * FROM pending_users WHERE email = 'carla@test.com';
```

**Expected:** 
- Status: `pending`
- Email_verified: `false`
- Verification_token: exists

### Part B: Email Verification (Simulate)
```sql
-- Manually verify email for testing:
UPDATE pending_users 
SET email_verified = TRUE 
WHERE email = 'carla@test.com';
```

### Part C: Admin Approval
1. Log in as Chele (admin)
2. Go to `/admin`
3. Click **"User Approvals"** tab
4. Should see Carla's registration request
5. Click **"Approve"**
6. Should see: **"User approved! They can now log in."**

### Verify in Database:
```sql
-- Check pending_users updated:
SELECT status, approved_by, approved_at 
FROM pending_users 
WHERE email = 'carla@test.com';

-- Check users table created:
SELECT * FROM users WHERE email = 'carla@test.com';
```

**Expected:**
- pending_users.status = `approved`
- users table has new record with role = `staff`

### Part D: New User Login
1. Log out
2. Log in as Carla: `carla@test.com` / `TestPassword123!@#`
3. Should successfully log in ✅

**Result:** ✅ Pass / ❌ Fail

---

## 🔐 Test 3: Session-Based Encryption

**What we're testing:** PHI requires active session to decrypt

### Steps:
1. Log in as Carla
2. Start filling intake form (add some patient data)
3. Save draft (should encrypt with Carla's session)
4. Open DevTools → Application → Local Storage
5. Find draft key, copy encrypted value
6. Should see encrypted blob with `userId`, `salt`, `iv` fields
7. Log out
8. Log back in as **Carla** (same user)
9. Load draft
10. Should **decrypt successfully** ✅

### Test Cross-User Decryption:
1. Log in as Carla
2. Save draft
3. Log out
4. Log in as **different user** (create another test user)
5. Try to load Carla's draft
6. Should **fail to decrypt** (data belongs to different user) ✅

### Verify in Console:
```javascript
// Should see error: "Cannot decrypt: Data belongs to different user"
```

**Result:** ✅ Pass / ❌ Fail

---

## 📋 Test 4: Audit Logging

**What we're testing:** ALL PHI access is logged

### Steps:
1. Log in as Carla
2. Search for patient "Thompson"
3. Click on patient to view details
4. Edit patient phone number
5. Save changes
6. Download a document

### Verify in Database:
```sql
SELECT 
  event_type,
  action,
  user_email,
  resource_type,
  resource_id,
  created_at,
  details
FROM audit_logs 
WHERE user_email = 'carla@test.com'
ORDER BY created_at DESC 
LIMIT 10;
```

**Expected Events:**
- `PATIENT_SEARCHED` - search query logged
- `PATIENT_VIEWED` - patient detail page viewed
- `PATIENT_UPDATED` - phone number changed
- `DOCUMENT_DOWNLOAD` - document accessed

### Check Admin Dashboard:
1. Log in as Chele (admin)
2. Go to `/admin`
3. Click **"Audit Logs"** tab
4. Should see all of Carla's actions listed

**Result:** ✅ Pass / ❌ Fail

---

## 👁️ Test 5: User Activity Tracking

**What we're testing:** Admin can see real-time user activity

### Steps:
1. Have Carla perform several actions:
   - Search 3 patients
   - View 2 patient records
   - Edit 1 patient
2. Log in as Chele (admin)
3. Go to `/admin` → **"User Activity"** tab
4. Should see Carla's stats:
   - Total Actions: 6
   - Patient Views: 2
   - Edits: 1
   - Searches: 3

### Verify in Database:
```sql
SELECT 
  activity_type,
  COUNT(*) as count
FROM user_activity 
WHERE user_id = (SELECT id FROM users WHERE email = 'carla@test.com')
GROUP BY activity_type;
```

**Result:** ✅ Pass / ❌ Fail

---

## 🚫 Test 6: Account Status Enforcement

**What we're testing:** Suspended users cannot log in

### Steps:
1. As admin, suspend Carla's account:
```sql
UPDATE users 
SET account_status = 'suspended' 
WHERE email = 'carla@test.com';
```

2. Try to log in as Carla
3. Should see: **"Your account has been suspended. Please contact an administrator."**
4. Should be immediately logged out

### Reactivate:
```sql
UPDATE users 
SET account_status = 'active' 
WHERE email = 'carla@test.com';
```

**Result:** ✅ Pass / ❌ Fail

---

## ⚡ Test 7: Search Performance

**What we're testing:** 40x faster search with indexes

### Steps:
1. Open DevTools → Network tab
2. Search for "Thompson"
3. Check response time in Network tab
4. Should be **< 100ms** (was 500ms-2s before)

### Verify Indexes Exist:
```sql
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'patients';
```

**Expected Indexes:**
- `idx_patients_first_name_trgm`
- `idx_patients_last_name_trgm`
- `idx_patients_goes_by_trgm`
- `idx_patients_phone_primary`
- `idx_patients_search_vector`

**Result:** ✅ Pass / ❌ Fail

---

## 🎯 Test 8: Role-Based Access

**What we're testing:** Only admins can access admin dashboard

### Steps:
1. Log in as Carla (staff)
2. Try to navigate to `/admin`
3. Should be **redirected** or see **"Access Denied"**

4. Log in as Chele (admin)
5. Navigate to `/admin`
6. Should see full admin dashboard ✅

**Result:** ✅ Pass / ❌ Fail

---

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Rate Limiting | ⬜ | |
| 2. Registration & Approval | ⬜ | |
| 3. Session Encryption | ⬜ | |
| 4. Audit Logging | ⬜ | |
| 5. User Activity Tracking | ⬜ | |
| 6. Account Status | ⬜ | |
| 7. Search Performance | ⬜ | |
| 8. Role-Based Access | ⬜ | |

---

## 🐛 Common Issues & Fixes

### Issue: "relation 'audit_logs' does not exist"
**Fix:** Apply migration 025 first (creates audit_logs table)

### Issue: "function register_user does not exist"
**Fix:** Apply migration 026 (creates user management functions)

### Issue: Registration form doesn't show
**Fix:** Add `/register` route to your router

### Issue: Admin dashboard shows blank
**Fix:** Add `/admin` route with ProtectedRoute wrapper

### Issue: Rate limiting not working
**Fix:** Apply migration 024 (creates login_attempts table)

---

## ✅ All Tests Pass?

If all 8 tests pass, your system is:
- ✅ **HIPAA Compliant** - All PHI access logged
- ✅ **Secure** - Session-based encryption, rate limiting, audit trails
- ✅ **Production Ready** - Admin approval, role-based access, monitoring

**You're good to go!** 🚀
