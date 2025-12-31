# 🧪 Complete End-to-End Testing Guide

**Purpose:** Verify all HIPAA compliance features work correctly  
**Time Required:** 30-45 minutes  
**Prerequisites:** Migrations applied, Edge Function deployed

---

## 🎯 **TESTING CHECKLIST**

### **Phase 1: Database Setup (5 minutes)**

#### **Test 1.1: Apply Migration 028**

```sql
-- Run in Supabase SQL Editor
-- Copy entire contents of: supabase/migrations/028_add_csrf_and_mfa_support.sql
-- Then verify:

-- Check csrf_tokens table exists
SELECT COUNT(*) FROM csrf_tokens;
-- Expected: 0 (table is empty but exists)

-- Check functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_name IN ('generate_csrf_token', 'validate_csrf_token', 'cleanup_expired_csrf_tokens');
-- Expected: 3 rows

-- Check MFA columns added
SELECT mfa_enabled, mfa_enabled_at, mfa_method FROM users LIMIT 1;
-- Expected: Columns exist (values may be NULL)

-- Check audit logs are immutable
DELETE FROM audit_logs WHERE id = (SELECT id FROM audit_logs LIMIT 1);
-- Expected: ERROR - permission denied
```

**✅ Pass Criteria:** All queries succeed, DELETE fails with permission error

---

### **Phase 2: Edge Function Deployment (5 minutes)**

#### **Test 2.1: Deploy Edge Function**

```bash
# In terminal
cd /Users/carloszamora/Desktop/support-house-app

# Login to Supabase
supabase login

# Link project
supabase link --project-ref zwcpoqeimpabivktyagy

# Deploy function
supabase functions deploy audit-log

# Verify deployment
supabase functions list
```

**✅ Pass Criteria:** Function shows as "ACTIVE" in list

#### **Test 2.2: Test Edge Function**

```bash
# Get your anon key from .env file
# Then test the function:

curl -i --location --request POST \
  'https://zwcpoqeimpabivktyagy.supabase.co/functions/v1/audit-log' \
  --header 'Authorization: Bearer YOUR_ANON_KEY_HERE' \
  --header 'Content-Type: application/json' \
  --data '{
    "event_type": "LOGIN",
    "action": "Test audit log",
    "success": true,
    "user_email": "test@example.com"
  }'
```

**✅ Pass Criteria:** 
- Response: `200 OK`
- Body includes: `{"success":true,"message":"Audit log created"}`
- Check database:
  ```sql
  SELECT event_type, ip_address, user_email 
  FROM audit_logs 
  WHERE user_email = 'test@example.com' 
  ORDER BY created_at DESC LIMIT 1;
  ```
- `ip_address` should NOT be NULL

---

### **Phase 3: CSRF Token System (5 minutes)**

#### **Test 3.1: Generate CSRF Token**

```sql
-- In Supabase SQL Editor
-- Replace with your actual user ID
SELECT generate_csrf_token('YOUR_USER_ID_HERE'::uuid, 1);
```

**✅ Pass Criteria:** Returns a long base64 string

#### **Test 3.2: Validate CSRF Token**

```sql
-- Use the token from Test 3.1
SELECT validate_csrf_token(
  'YOUR_USER_ID_HERE'::uuid, 
  'TOKEN_FROM_PREVIOUS_STEP'
);
```

**✅ Pass Criteria:** Returns `true`

#### **Test 3.3: Validate Expired Token**

```sql
-- Wait 2 seconds, then try to validate again
-- (tokens expire after 1 hour, but we can test with a short-lived one)

-- First, create a token that expires in 1 second
INSERT INTO csrf_tokens (user_id, token, expires_at)
VALUES (
  'YOUR_USER_ID_HERE'::uuid,
  'test-expired-token',
  NOW() + INTERVAL '1 second'
);

-- Wait 2 seconds, then validate
SELECT validate_csrf_token('YOUR_USER_ID_HERE'::uuid, 'test-expired-token');
```

**✅ Pass Criteria:** Returns `false` (token expired)

#### **Test 3.4: Cleanup Function**

```sql
-- Run cleanup function
SELECT cleanup_expired_csrf_tokens();

-- Verify expired tokens were deleted
SELECT COUNT(*) FROM csrf_tokens WHERE expires_at < NOW();
```

**✅ Pass Criteria:** Returns `0` (all expired tokens deleted)

---

### **Phase 4: Two-Factor Authentication (10 minutes)**

#### **Test 4.1: Start Development Server**

```bash
npm run dev
```

#### **Test 4.2: Login as Admin**

1. Go to http://localhost:5173/login
2. Login with: `chele@supporthouse.com` / your password
3. Verify you reach the dashboard

**✅ Pass Criteria:** Successful login, no MFA prompt (not enabled yet)

#### **Test 4.3: Enable 2FA**

1. Go to http://localhost:5173/admin
2. Click **"Enable 2FA"** button in Security Settings section
3. Verify QR code appears
4. Scan QR code with Google Authenticator or Authy
5. Enter 6-digit code from authenticator app
6. Click **"Verify & Enable"**

**✅ Pass Criteria:** 
- Success message appears
- Button changes to "Manage 2FA"
- Check database:
  ```sql
  SELECT mfa_enabled, mfa_enabled_at 
  FROM users 
  WHERE email = 'chele@supporthouse.com';
  ```
- `mfa_enabled` should be `TRUE`

#### **Test 4.4: Test 2FA Login**

1. Logout
2. Login again with email/password
3. Verify MFA modal appears
4. Enter 6-digit code from authenticator
5. Click **"Verify"**

**✅ Pass Criteria:** 
- MFA modal appears after password
- Correct code allows login
- Wrong code shows error
- Check audit log:
  ```sql
  SELECT event_type, success, user_email 
  FROM audit_logs 
  WHERE event_type = '2FA_VERIFIED' 
  AND user_email = 'chele@supporthouse.com'
  ORDER BY created_at DESC LIMIT 1;
  ```

#### **Test 4.5: Cancel 2FA**

1. Logout
2. Login with password
3. When MFA modal appears, click **"Cancel"**

**✅ Pass Criteria:** 
- User is logged out
- Error message shows "2FA verification required"
- Cannot access dashboard

---

### **Phase 5: Audit Logging Integration (5 minutes)**

#### **Test 5.1: Patient View Logging**

1. Login to app
2. Go to patient search
3. Search for a patient
4. Click on a patient to view details

**Check audit log:**
```sql
SELECT event_type, action, resource_type, resource_id, ip_address, user_email
FROM audit_logs 
WHERE event_type = 'PATIENT_VIEWED'
ORDER BY created_at DESC LIMIT 5;
```

**✅ Pass Criteria:** 
- New audit log entry created
- `ip_address` is NOT NULL
- `resource_id` matches patient ID
- `user_email` matches your email

#### **Test 5.2: Search Logging**

1. Perform a patient search
2. Check audit log:

```sql
SELECT event_type, details, user_email
FROM audit_logs 
WHERE event_type = 'PATIENT_SEARCHED'
ORDER BY created_at DESC LIMIT 1;
```

**✅ Pass Criteria:** 
- Search logged with search term
- Result count included in details

#### **Test 5.3: Login Logging**

```sql
-- Check recent login events
SELECT event_type, success, ip_address, user_email, created_at
FROM audit_logs 
WHERE event_type IN ('LOGIN', 'LOGIN_FAILED', '2FA_VERIFIED')
ORDER BY created_at DESC LIMIT 10;
```

**✅ Pass Criteria:** 
- All login attempts logged
- IP addresses captured
- Success/failure tracked

---

### **Phase 6: Integration Tests (5 minutes)**

#### **Test 6.1: Complete User Flow**

1. **Register new user:**
   - Go to `/register`
   - Fill form with test data
   - Submit
   - Check email for verification link
   - Click verification link

2. **Admin approves user:**
   - Login as admin
   - Go to `/admin` → User Approvals
   - Approve the new user

3. **New user logs in:**
   - Login with new user credentials
   - Verify access to dashboard

**✅ Pass Criteria:** Complete flow works without errors

#### **Test 6.2: Check-In Flow with Audit**

1. Search for a patient
2. Click "Check In"
3. Add assistance items
4. Submit check-in

**Check audit logs:**
```sql
SELECT event_type, action, resource_type, user_email
FROM audit_logs 
WHERE event_type IN ('PATIENT_VIEWED', 'VISIT_CREATED')
AND user_email = 'YOUR_EMAIL'
ORDER BY created_at DESC LIMIT 5;
```

**✅ Pass Criteria:** 
- Patient view logged
- Visit creation logged
- All with IP addresses

---

### **Phase 7: Security Verification (5 minutes)**

#### **Test 7.1: Verify Immutable Logs**

```sql
-- Try to update an audit log
UPDATE audit_logs 
SET event_type = 'HACKED' 
WHERE id = (SELECT id FROM audit_logs LIMIT 1);

-- Try to delete an audit log
DELETE FROM audit_logs 
WHERE id = (SELECT id FROM audit_logs LIMIT 1);
```

**✅ Pass Criteria:** Both queries fail with "permission denied"

#### **Test 7.2: Verify RLS Policies**

```sql
-- Check CSRF tokens are user-specific
SELECT * FROM csrf_tokens;
-- Should only see your own tokens

-- Check audit logs are readable
SELECT COUNT(*) FROM audit_logs;
-- Should return count (readable by authenticated users)
```

**✅ Pass Criteria:** RLS policies working correctly

#### **Test 7.3: Session Timeout**

1. Login to app
2. Wait 15 minutes (or change timeout in `sessionManager.ts` to 1 minute for testing)
3. Try to perform an action

**✅ Pass Criteria:** 
- Warning modal appears at 2 minutes before timeout
- User is logged out after timeout
- Redirected to login page

---

## 📊 **TEST RESULTS SUMMARY**

| Phase | Tests | Status |
|-------|-------|--------|
| 1. Database Setup | 1 | ⬜ Not Run |
| 2. Edge Function | 2 | ⬜ Not Run |
| 3. CSRF Tokens | 4 | ⬜ Not Run |
| 4. Two-Factor Auth | 5 | ⬜ Not Run |
| 5. Audit Logging | 3 | ⬜ Not Run |
| 6. Integration | 2 | ⬜ Not Run |
| 7. Security | 3 | ⬜ Not Run |
| **TOTAL** | **20** | **0/20 Passed** |

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: Edge Function Returns 401**

**Symptom:** `curl` test returns "Unauthorized"

**Fix:**
```bash
# Make sure you're using the correct anon key
cat .env | grep VITE_SUPABASE_ANON_KEY
```

### **Issue 2: MFA Modal Doesn't Appear**

**Symptom:** Login succeeds without MFA prompt

**Fix:**
1. Check browser console for errors
2. Verify `mfaService.isMFAEnabled()` is being called
3. Check database:
   ```sql
   SELECT mfa_enabled FROM users WHERE email = 'YOUR_EMAIL';
   ```

### **Issue 3: IP Address is NULL**

**Symptom:** Audit logs show `ip_address = NULL`

**Fix:**
1. Verify Edge Function is deployed:
   ```bash
   supabase functions list
   ```
2. Check function logs:
   ```bash
   supabase functions logs audit-log
   ```
3. Verify `auditService` is being used (not old `auditLogger`)

### **Issue 4: CSRF Token Generation Fails**

**Symptom:** `generate_csrf_token()` returns error

**Fix:**
1. Verify migration 028 was applied
2. Check function exists:
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_name = 'generate_csrf_token';
   ```
3. Check user ID is valid UUID

---

## ✅ **SUCCESS CRITERIA**

**All tests pass when:**
- ✅ All 20 tests complete successfully
- ✅ No errors in browser console
- ✅ No errors in Supabase logs
- ✅ IP addresses captured in audit logs
- ✅ 2FA works for login
- ✅ CSRF tokens generate and validate
- ✅ Audit logs are immutable

---

## 📝 **AFTER TESTING**

Once all tests pass:

1. **Document results:**
   - Take screenshots of successful tests
   - Save audit log queries showing IP addresses
   - Export test data for compliance records

2. **Enable for production:**
   - Require 2FA for all admin accounts
   - Schedule CSRF cleanup job
   - Schedule audit log archive job
   - Monitor Edge Function logs

3. **Train staff:**
   - How to enable 2FA
   - How to use authenticator apps
   - What to do if locked out

---

**Last Updated:** December 30, 2025  
**Version:** 1.0  
**Next Review:** After all tests pass
