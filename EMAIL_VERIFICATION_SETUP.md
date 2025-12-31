# 📧 Email Verification Setup Guide

## ✅ What's Implemented

Your registration system now uses **Supabase Auth's built-in email verification**!

When users register:
1. ✅ Supabase Auth user created
2. ✅ **Verification email sent automatically** by Supabase
3. ✅ User clicks link in email
4. ✅ Redirected to `/verify-email` page
5. ✅ Email marked as verified in database
6. ✅ User sees "pending admin approval" message
7. ✅ Admin (Chele) approves in dashboard
8. ✅ User can log in!

---

## 🔧 Supabase Configuration Required

### **Step 1: Configure Email Settings**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Email Templates**
4. Click **"Confirm signup"** template

### **Step 2: Customize Email Template (Optional)**

Update the email template to match your branding:

```html
<h2>Welcome to Reynolds Cancer Support House!</h2>

<p>Thank you for requesting access to our Patient Management System.</p>

<p>Please click the link below to verify your email address:</p>

<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>

<p>Once verified, your registration will be reviewed by an administrator.</p>

<p>If you didn't request this, please ignore this email.</p>

<p>💜 Caring for those who need it most</p>
```

### **Step 3: Set Redirect URL**

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `http://localhost:5173/verify-email` (for development)
   - `https://yourdomain.com/verify-email` (for production)

### **Step 4: Configure Site URL**

1. In **Authentication** → **URL Configuration**
2. Set **Site URL** to:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`

---

## 🧪 Testing Email Verification

### **Test Flow:**

1. **Register a new user:**
   - Go to `/register`
   - Fill out form with real email
   - Submit

2. **Check your email:**
   - Look for email from Supabase
   - Subject: "Confirm your signup"
   - Click verification link

3. **Verify redirect:**
   - Should redirect to `/verify-email`
   - Should see "Email Verified!" message
   - Should see "pending admin approval" notice

4. **Check database:**
   ```sql
   SELECT email, email_verified, status 
   FROM pending_users 
   WHERE email = 'test@test.com';
   ```
   - `email_verified` should be `TRUE`
   - `status` should be `pending`

5. **Admin approves:**
   - Log in as admin (Chele)
   - Go to `/admin` → User Approvals
   - Click "Approve"

6. **User can log in:**
   - User receives approval notification (if configured)
   - User can now log in with their credentials

---

## 📧 Email Provider Options

### **Option 1: Use Supabase's Default Email (Easiest)**
- ✅ Already configured
- ✅ Works out of the box
- ⚠️ Limited to 3 emails per hour (free tier)
- ⚠️ Emails may go to spam

### **Option 2: Use Custom SMTP (Recommended for Production)**

Configure in Supabase Dashboard → **Project Settings** → **Auth**:

**Example with Gmail:**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: your-app-password
Sender Email: noreply@yourdomain.com
Sender Name: Reynolds Cancer Support House
```

**Example with SendGrid:**
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: YOUR_SENDGRID_API_KEY
Sender Email: noreply@yourdomain.com
Sender Name: Reynolds Cancer Support House
```

---

## 🔒 Security Features

✅ **Email verification required** before admin approval
✅ **Strong password validation** (12+ chars, complexity)
✅ **Admin approval required** after email verification
✅ **Automatic email sending** via Supabase
✅ **Secure verification tokens** (handled by Supabase)

---

## 🐛 Troubleshooting

### **Issue: Emails not sending**
**Fix:** Check Supabase Dashboard → Authentication → Email Templates → Enable "Confirm signup"

### **Issue: Emails going to spam**
**Fix:** Configure custom SMTP with your domain (Option 2 above)

### **Issue: Verification link doesn't work**
**Fix:** Make sure redirect URL is added in Supabase Dashboard → Authentication → URL Configuration

### **Issue: User can't log in after verification**
**Fix:** Admin must approve the user in `/admin` dashboard first

### **Issue: "Email already registered" error**
**Fix:** Check if user already exists in `auth.users` table - may need to delete and re-register

---

## 📋 Complete Registration Flow

```
1. User visits /register
   ↓
2. Fills form + submits
   ↓
3. Supabase Auth user created
   ↓
4. Verification email sent automatically ✉️
   ↓
5. User clicks link in email
   ↓
6. Redirected to /verify-email
   ↓
7. Email verified ✅
   ↓
8. pending_users.email_verified = TRUE
   ↓
9. Admin sees in /admin dashboard
   ↓
10. Admin clicks "Approve"
   ↓
11. User record created in users table
   ↓
12. User can log in! 🎉
```

---

## ✅ What's Ready

- ✅ Email service created (`src/services/emailService.ts`)
- ✅ RegisterForm updated to use Supabase Auth
- ✅ Verification page created (`/verify-email`)
- ✅ Route added to App.tsx
- ✅ Automatic email sending configured

**Just configure the redirect URLs in Supabase Dashboard and you're ready to test!** 🚀
