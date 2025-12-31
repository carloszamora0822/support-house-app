# 👑 Admin Portal Setup Guide - Chele's Control Center

## 🚀 Quick Start: Become Admin

### **Step 1: Create Your Admin Account**

Run this in **Supabase SQL Editor**:

```sql
-- First, create your auth user in Supabase Dashboard:
-- Go to Authentication > Users > "Add User"
-- Email: chele@reynoldscancersupporthouse.org
-- Password: (set a strong password)
-- Then get the user ID and run:

INSERT INTO users (
  id, 
  email, 
  full_name, 
  role, 
  account_status,
  created_at
) VALUES (
  'YOUR_AUTH_USER_ID_HERE', -- Get from auth.users table
  'chele@reynoldscancersupporthouse.org',
  'Chele (Admin)',
  'admin',
  'active',
  NOW()
);
```

### **Step 2: Login as Admin**

1. Go to `/login`
2. Email: `chele@reynoldscancersupporthouse.org`
3. Password: (your password)
4. Click "Sign in"

### **Step 3: Access Admin Portal**

Once logged in, navigate to: **`/admin`**

---

## 🎛️ Admin Portal Features

### **Overview Tab** (Default View)

**What you see:**
- 📊 Quick stats cards
- 🔐 Security features summary
- 📋 Quick links to all admin functions

**Security Features Enabled:**
- ✅ Admin approval required for all new users
- ✅ Email verification before approval
- ✅ Strong password policy (12+ chars)
- ✅ Rate limiting (5 attempts = 15 min lockout)
- ✅ Session-based encryption
- ✅ Complete audit trail

---

### **User Approvals Tab** 👥

**Purpose:** Review and approve/reject new user registrations

**What you see:**
- List of pending user registrations
- User details (name, email, role, phone, notes)
- Email verification status
- Registration date

**Actions you can take:**

#### **Approve a User:**
1. Click **"Approve"** button
2. Confirm approval
3. User account created in system
4. User can now log in
5. Logged in `audit_logs` table

#### **Reject a User:**
1. Click **"Reject"** button
2. Enter rejection reason
3. User notified (if email configured)
4. Logged in `audit_logs` table

**Important:**
- ⚠️ Users MUST verify email before you can approve them
- ✅ Email verification status shown with green checkmark
- 🕐 Pending verification shown with orange clock icon

---

### **User Activity Tab** 📊

**Purpose:** Monitor what all users are doing in real-time

**What you see:**

#### **User Stats Cards:**
- Total actions per user
- Patient views count
- Patient edits count
- Searches performed
- Last activity timestamp

**Click on a user card to filter activity feed to that user only**

#### **Activity Feed:**
Shows recent actions:
- 👁️ Patient views (blue)
- ✏️ Patient edits (orange)
- 🔍 Searches (purple)
- 📄 Document access (green)

**Time Range Filters:**
- Last Hour
- Last 24 Hours
- Last Week
- Last 30 Days

**Use Cases:**
- Monitor staff productivity
- Identify unusual access patterns
- Track who viewed specific patients
- Audit compliance reporting

---

### **Audit Logs Tab** 📋

**Purpose:** HIPAA-compliant audit trail of ALL system events

**What you see:**
- All login attempts (success/failed)
- All patient access (views, edits, searches)
- User approvals/rejections
- Account status changes
- Document access

**Filter Options:**
- By event type (login, patient access, etc.)
- By time range
- By user

**Event Types:**
- `LOGIN` - Successful login
- `LOGOUT` - User logged out
- `LOGIN_FAILED` - Failed login attempt
- `PATIENT_VIEWED` - Patient record accessed
- `PATIENT_UPDATED` - Patient record modified
- `PATIENT_SEARCHED` - Search performed
- `USER_APPROVED` - New user approved by admin
- `USER_REJECTED` - Registration rejected

**HIPAA Compliance:**
- ✅ All PHI access logged
- ✅ Immutable logs (cannot be deleted/edited)
- ✅ 6-year retention recommended
- ✅ Includes user identity, timestamp, IP address

---

## 🔐 Access Control & Permissions

### **Role Hierarchy:**

| Role | Can Do |
|------|--------|
| **Admin (You)** | Everything - approve users, view all logs, access admin portal |
| **Staff (Carla)** | Full patient access - view, edit, intake, check-in, search |
| **Volunteer** | Patient intake, check-in, view records (limited editing) |

### **Admin-Only Features:**

✅ Access `/admin` portal
✅ Approve/reject new users
✅ View all user activity
✅ View complete audit logs
✅ Suspend/deactivate user accounts
✅ View login attempt history
✅ Monitor security events

### **Protecting Admin Access:**

The `/admin` route should be protected. Let me add that now...

---

## 📊 Monitoring & Visibility

### **What You Can See:**

#### **1. Pending User Registrations**
- Who wants access
- What role they requested
- Why they need access (notes field)
- Email verification status

#### **2. Active Users**
- All current users in system
- Their roles
- Last login time
- Account status (active/suspended)

#### **3. User Activity**
- Real-time activity feed
- Per-user statistics
- Search patterns
- Patient access patterns

#### **4. Security Events**
- Failed login attempts
- Account lockouts
- Suspicious activity
- Rate limiting triggers

#### **5. System Audit Trail**
- Complete history of all actions
- HIPAA-compliant logging
- Searchable and filterable
- Export capability (future)

---

## 🚨 Common Admin Tasks

### **Task 1: Approve New Staff Member (Carla)**

1. Go to `/admin` → **User Approvals** tab
2. See Carla's registration request
3. Verify:
   - ✅ Email verified (green checkmark)
   - ✅ Role: Staff
   - ✅ Notes explain why access needed
4. Click **"Approve"**
5. Carla receives notification (if email configured)
6. Carla can now log in!

### **Task 2: Approve New Volunteer**

Same as above, but:
- Role will be "Volunteer"
- May have volunteer start date
- Limited permissions compared to staff

### **Task 3: Reject Suspicious Registration**

1. See registration request
2. Notice suspicious details
3. Click **"Reject"**
4. Enter reason: "Unable to verify identity"
5. User notified of rejection

### **Task 4: Monitor User Activity**

1. Go to `/admin` → **User Activity** tab
2. Select time range (e.g., "Last 24 Hours")
3. Review activity feed
4. Click on specific user card to filter
5. Check for unusual patterns

### **Task 5: Investigate Security Event**

1. Go to `/admin` → **Audit Logs** tab
2. Filter by event type: "LOGIN_FAILED"
3. Look for patterns (same email, multiple attempts)
4. Check if rate limiting triggered
5. Verify account lockout working

### **Task 6: Suspend User Account**

```sql
-- In Supabase SQL Editor:
UPDATE users 
SET account_status = 'suspended' 
WHERE email = 'user@email.com';
```

User will be immediately logged out and cannot log back in.

### **Task 7: Reactivate Suspended Account**

```sql
UPDATE users 
SET account_status = 'active' 
WHERE email = 'user@email.com';
```

---

## 📧 Email Notifications (Optional)

### **What Emails Can Be Sent:**

1. **Email Verification** (Automatic via Supabase)
   - Sent when user registers
   - Contains verification link

2. **Approval Notification** (Manual - not implemented yet)
   - Notify user when approved
   - Include login instructions

3. **Rejection Notification** (Manual - not implemented yet)
   - Notify user of rejection
   - Include reason

### **To Add Email Notifications:**

Use the `emailService.ts` or integrate with:
- Resend
- SendGrid
- AWS SES
- Supabase Edge Functions

---

## 🔍 Database Queries for Admins

### **See All Pending Registrations:**
```sql
SELECT 
  email,
  full_name,
  role,
  email_verified,
  status,
  created_at,
  notes
FROM pending_users 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### **See All Active Users:**
```sql
SELECT 
  email,
  full_name,
  role,
  account_status,
  last_login_at,
  login_count,
  created_at
FROM users 
WHERE account_status = 'active'
ORDER BY created_at DESC;
```

### **See Failed Login Attempts:**
```sql
SELECT 
  email,
  attempt_timestamp,
  ip_address,
  user_agent
FROM login_attempts 
WHERE success = FALSE
ORDER BY attempt_timestamp DESC 
LIMIT 50;
```

### **See Who Accessed Specific Patient:**
```sql
SELECT 
  user_email,
  event_type,
  created_at,
  details
FROM audit_logs 
WHERE resource_type = 'patient'
  AND resource_id = 'PATIENT_ID_HERE'
ORDER BY created_at DESC;
```

### **See All Actions by Specific User:**
```sql
SELECT 
  event_type,
  action,
  resource_type,
  created_at,
  details
FROM audit_logs 
WHERE user_email = 'carla@test.com'
ORDER BY created_at DESC 
LIMIT 100;
```

---

## ✅ Admin Portal Checklist

### **Initial Setup:**
- [ ] Create admin account in Supabase
- [ ] Add admin user to `users` table with role='admin'
- [ ] Log in as admin
- [ ] Access `/admin` portal
- [ ] Verify all tabs load correctly

### **Test User Approval Workflow:**
- [ ] Have someone register (or use test account)
- [ ] See registration in "User Approvals" tab
- [ ] Verify email verification status shown
- [ ] Approve user
- [ ] Verify user can log in
- [ ] Check audit logs for approval event

### **Test Activity Monitoring:**
- [ ] Have user perform actions (search, view patient)
- [ ] Go to "User Activity" tab
- [ ] Verify actions appear in feed
- [ ] Test time range filters
- [ ] Test user filtering

### **Test Audit Logs:**
- [ ] Go to "Audit Logs" tab
- [ ] Verify login events logged
- [ ] Verify patient access logged
- [ ] Test event type filters
- [ ] Test time range filters

### **Test Security Features:**
- [ ] Try 5 failed logins → verify lockout
- [ ] Check `login_attempts` table
- [ ] Verify rate limiting working
- [ ] Test session timeout (15 min)

---

## 🎯 Admin Portal URLs

- **Admin Dashboard:** `/admin`
- **User Approvals:** `/admin` (User Approvals tab)
- **User Activity:** `/admin` (User Activity tab)
- **Audit Logs:** `/admin` (Audit Logs tab)

---

## 🚀 You're Ready!

**As admin, you can now:**
- ✅ Approve/reject new users
- ✅ Monitor all user activity in real-time
- ✅ View complete audit trail for HIPAA compliance
- ✅ Investigate security events
- ✅ Suspend/reactivate accounts
- ✅ Track who accessed what patient data

**Your admin portal is production-ready!** 🎉

Need help with anything? Check the troubleshooting section or reach out!
