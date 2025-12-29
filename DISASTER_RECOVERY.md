# Disaster Recovery & Business Continuity Plan

**Application:** Support House Patient Management System  
**Last Updated:** December 29, 2025  
**Version:** 1.0

---

## 🎯 OVERVIEW

This document outlines disaster recovery procedures and business continuity strategies to protect patient data and ensure service availability during outages, disasters, or security incidents.

---

## 🔄 SUPABASE BACKUP & RECOVERY

### **Automatic Backups (Built-in)**

Supabase provides **automatic daily backups** for all paid plans:

✅ **What's Backed Up:**
- All database tables and data
- Database schema (tables, columns, indexes)
- Row Level Security (RLS) policies
- Database functions and triggers
- User authentication data

✅ **Backup Schedule:**
- **Daily backups** retained for 7 days (Pro plan)
- **Weekly backups** retained for 4 weeks (Pro plan)
- **Monthly backups** retained for 3 months (Pro plan)

✅ **Backup Location:**
- Stored in separate AWS region from primary database
- Encrypted at rest (AES-256)
- Geographically distributed

### **Point-in-Time Recovery (PITR)**

For Team/Enterprise plans, Supabase offers PITR:

✅ **Features:**
- Restore to any point in time within retention window
- Retention: Up to 30 days (configurable)
- Recovery Time Objective (RTO): < 1 hour
- Recovery Point Objective (RPO): < 5 minutes

---

## 💾 BACKUP STRATEGY

### **1. Database Backups**

**Supabase Automatic Backups:**
```bash
# Backups happen automatically
# Access via Supabase Dashboard > Database > Backups
```

**Manual Backup (Additional Safety):**
```bash
# Export database schema
supabase db dump --schema-only > schema_backup.sql

# Export all data
supabase db dump --data-only > data_backup.sql

# Full backup (schema + data)
supabase db dump > full_backup.sql
```

**Recommended Schedule:**
- ✅ **Daily:** Automatic Supabase backups
- ✅ **Weekly:** Manual export to local storage
- ✅ **Monthly:** Archive to external storage (AWS S3, Google Drive)

### **2. Application Code Backups**

**Git Repository (Primary):**
```bash
# Already backed up on GitHub/GitLab
git push origin main
```

**Recommended:**
- ✅ Use GitHub/GitLab for version control
- ✅ Enable branch protection on `main`
- ✅ Tag releases: `git tag v1.0.0`
- ✅ Mirror to secondary remote (optional)

### **3. Environment Variables**

**Backup `.env` files securely:**
```bash
# DO NOT commit to Git!
# Store in password manager (1Password, LastPass, etc.)
# Or encrypted storage (AWS Secrets Manager, Vault)
```

**Critical Variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (if used)

### **4. Audit Logs**

**Server-Side (Supabase):**
- ✅ Stored in `audit_logs` table
- ✅ Backed up with database
- ✅ Retained for 2 years (HIPAA requirement)

**Client-Side (localStorage):**
- ✅ Backup stored locally
- ✅ Export monthly: `auditLogger.exportLogs()`
- ✅ Archive to secure storage

---

## 🚨 DISASTER SCENARIOS & RECOVERY

### **Scenario 1: Database Corruption**

**Symptoms:**
- Data inconsistencies
- Query errors
- Missing records

**Recovery Steps:**
1. **Stop all writes** to database
2. **Identify corruption scope** (which tables/records)
3. **Restore from backup:**
   ```bash
   # Via Supabase Dashboard
   # Database > Backups > Select backup > Restore
   ```
4. **Verify data integrity**
5. **Resume operations**

**RTO:** 1-2 hours  
**RPO:** Up to 24 hours (daily backup)

---

### **Scenario 2: Supabase Outage**

**Symptoms:**
- Cannot connect to database
- API errors
- Authentication failures

**Immediate Actions:**
1. **Check Supabase Status:** https://status.supabase.com
2. **Enable maintenance mode** (show users a message)
3. **Monitor for updates**

**Recovery Steps:**
- **If regional outage:** Supabase auto-fails over to backup region
- **If extended outage:** 
  - Restore from backup to new Supabase project
  - Update environment variables
  - Redeploy application

**RTO:** 2-4 hours  
**RPO:** Up to 24 hours

**Prevention:**
- ✅ Subscribe to Supabase status updates
- ✅ Have backup Supabase project ready (optional)
- ✅ Document failover procedures

---

### **Scenario 3: Accidental Data Deletion**

**Symptoms:**
- Users report missing data
- Audit logs show DELETE operations

**Recovery Steps:**
1. **Identify what was deleted** (check audit logs)
2. **Determine deletion time**
3. **Restore from backup:**
   - If < 24 hours: Use daily backup
   - If < 7 days: Use weekly backup
   - If using PITR: Restore to exact time before deletion
4. **Verify restored data**
5. **Investigate cause** (user error, bug, malicious)

**RTO:** 1-3 hours  
**RPO:** Depends on backup schedule

**Prevention:**
- ✅ Soft deletes (mark as deleted, don't actually delete)
- ✅ Require confirmation for delete operations
- ✅ Admin-only delete permissions

---

### **Scenario 4: Security Breach**

**Symptoms:**
- Unauthorized access attempts
- Suspicious audit log entries
- Data exfiltration

**Immediate Actions:**
1. **Isolate the breach:**
   - Disable compromised user accounts
   - Rotate API keys
   - Change database passwords
2. **Assess damage:**
   - Review audit logs
   - Identify compromised data
   - Determine breach scope
3. **Notify stakeholders:**
   - HIPAA breach notification (if PHI compromised)
   - Affected patients (if required)
   - Legal/compliance team

**Recovery Steps:**
1. **Restore from clean backup** (before breach)
2. **Patch security vulnerability**
3. **Reset all credentials**
4. **Implement additional security measures**
5. **Monitor for further attempts**

**RTO:** 4-8 hours  
**RPO:** Depends on breach timing

**Prevention:**
- ✅ Regular security audits
- ✅ Penetration testing
- ✅ Monitor audit logs daily
- ✅ Enable 2FA for all admin accounts

---

### **Scenario 5: Hosting Platform Outage (Vercel/Netlify)**

**Symptoms:**
- Website unreachable
- 502/503 errors
- DNS issues

**Immediate Actions:**
1. **Check platform status**
2. **Verify DNS configuration**
3. **Check deployment logs**

**Recovery Steps:**
1. **If platform outage:** Wait for resolution
2. **If deployment issue:**
   - Rollback to previous deployment
   - Fix and redeploy
3. **If DNS issue:**
   - Verify DNS records
   - Update if needed (propagation: 24-48 hours)

**Alternative Deployment:**
```bash
# Deploy to backup platform
# Vercel → Netlify or vice versa
npm run build
# Upload to alternative platform
```

**RTO:** 1-2 hours  
**RPO:** 0 (frontend only, no data loss)

---

## 📊 RECOVERY TIME & POINT OBJECTIVES

| Scenario | RTO (Recovery Time) | RPO (Data Loss) | Priority |
|----------|---------------------|-----------------|----------|
| Database Corruption | 1-2 hours | 24 hours | HIGH |
| Supabase Outage | 2-4 hours | 24 hours | CRITICAL |
| Accidental Deletion | 1-3 hours | 24 hours | MEDIUM |
| Security Breach | 4-8 hours | Varies | CRITICAL |
| Hosting Outage | 1-2 hours | 0 hours | MEDIUM |
| Complete Data Loss | 8-24 hours | 24 hours | CRITICAL |

---

## 🔧 RECOVERY PROCEDURES

### **Database Restore (Supabase Dashboard)**

1. **Login to Supabase Dashboard**
2. **Navigate to:** Project > Database > Backups
3. **Select backup** to restore from
4. **Click "Restore"**
5. **Confirm restoration** (this will overwrite current data!)
6. **Wait for completion** (5-30 minutes depending on size)
7. **Verify data** after restoration

### **Database Restore (CLI)**

```bash
# 1. Download backup
supabase db dump --db-url "postgresql://..." > backup.sql

# 2. Restore to database
psql "postgresql://..." < backup.sql

# 3. Verify restoration
psql "postgresql://..." -c "SELECT COUNT(*) FROM patients;"
```

### **Application Redeployment**

```bash
# 1. Clone repository
git clone https://github.com/your-org/support-house-app.git
cd support-house-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with correct values

# 4. Build application
npm run build

# 5. Deploy
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

---

## 🛡️ DATA PROTECTION STRATEGIES

### **1. Redundancy**

✅ **Database:**
- Supabase: Multi-AZ deployment (automatic)
- Daily backups to separate region
- Optional: Secondary Supabase project (warm standby)

✅ **Application:**
- Git repository (GitHub/GitLab)
- Deployed to CDN (Vercel/Netlify)
- Can redeploy to alternative platform

✅ **Audit Logs:**
- Stored in Supabase (backed up)
- Local backup in localStorage
- Monthly exports to external storage

### **2. Encryption**

✅ **In Transit:**
- HTTPS/TLS 1.2+ (enforced)
- Supabase API uses HTTPS
- All API calls encrypted

✅ **At Rest:**
- Supabase: AES-256 encryption
- Backups: Encrypted
- localStorage: AES-256-GCM (our implementation)

### **3. Access Control**

✅ **Database:**
- Row Level Security (RLS) policies
- Role-based access (admin, staff, viewer)
- Service role key secured (not in frontend)

✅ **Application:**
- JWT authentication
- Session timeout (15 minutes)
- Rate limiting (5 failed attempts)

### **4. Monitoring**

✅ **Uptime Monitoring:**
- Use: UptimeRobot, Pingdom, or StatusCake
- Monitor: API endpoint, database connectivity
- Alert: Email, SMS, Slack

✅ **Error Tracking:**
- Use: Sentry, LogRocket, or Rollbar
- Track: JavaScript errors, API failures
- Alert: Critical errors immediately

✅ **Audit Log Monitoring:**
- Daily review of failed logins
- Weekly review of PHI access
- Monthly compliance reports

---

## 📋 BUSINESS CONTINUITY CHECKLIST

### **Daily**
- [ ] Verify Supabase backup completed
- [ ] Review critical error logs
- [ ] Check uptime monitoring

### **Weekly**
- [ ] Manual database export
- [ ] Review audit logs for anomalies
- [ ] Test application functionality
- [ ] Verify backup integrity

### **Monthly**
- [ ] Archive audit logs to external storage
- [ ] Review and update recovery procedures
- [ ] Test backup restoration (non-production)
- [ ] Security vulnerability scan

### **Quarterly**
- [ ] Full disaster recovery drill
- [ ] Update contact information
- [ ] Review and update RTO/RPO targets
- [ ] Compliance audit

### **Annually**
- [ ] Penetration testing
- [ ] Business continuity plan review
- [ ] Update disaster recovery documentation
- [ ] Staff training on recovery procedures

---

## 📞 EMERGENCY CONTACTS

**Technical Team:**
- Primary Admin: [NAME] - [EMAIL] - [PHONE]
- Backup Admin: [NAME] - [EMAIL] - [PHONE]
- DevOps: [NAME] - [EMAIL] - [PHONE]

**Vendors:**
- Supabase Support: support@supabase.io
- Hosting Support: [Vercel/Netlify support]
- Security Incident: [Security team email]

**Compliance:**
- HIPAA Officer: [NAME] - [EMAIL] - [PHONE]
- Legal Counsel: [NAME] - [EMAIL] - [PHONE]

---

## 🚀 SUPABASE FEATURES FOR DISASTER RECOVERY

### **Built-in Features:**

✅ **Automatic Backups**
- Daily, weekly, monthly retention
- Encrypted and geo-distributed
- One-click restore

✅ **Point-in-Time Recovery (PITR)**
- Restore to any second within retention window
- Minimal data loss (RPO < 5 minutes)
- Available on Team/Enterprise plans

✅ **High Availability**
- Multi-AZ deployment
- Automatic failover
- 99.9% uptime SLA (Pro plan)

✅ **Read Replicas** (Enterprise)
- Distribute read load
- Geographic distribution
- Failover capability

✅ **Database Branching** (Preview)
- Create database copies for testing
- Safe schema migrations
- Zero-downtime deployments

### **Recommended Supabase Plan:**

**For Production with PHI:**
- **Minimum:** Pro Plan ($25/month)
  - Daily backups (7 days retention)
  - 99.9% uptime SLA
  - Priority support
  
- **Recommended:** Team Plan ($599/month)
  - Point-in-Time Recovery
  - Extended backup retention
  - Dedicated support
  - SOC2 compliance

---

## 📈 IMPROVING DISASTER RECOVERY

### **Short-term (Next 30 days):**
1. ✅ Set up uptime monitoring
2. ✅ Configure error tracking (Sentry)
3. ✅ Document recovery procedures
4. ✅ Test backup restoration
5. ✅ Create runbook for common issues

### **Medium-term (Next 90 days):**
1. ⚠️ Upgrade to Supabase Pro plan
2. ⚠️ Implement soft deletes
3. ⚠️ Set up secondary Supabase project (warm standby)
4. ⚠️ Automate backup exports
5. ⚠️ Create disaster recovery dashboard

### **Long-term (Next 6 months):**
1. ⚠️ Upgrade to Team plan (PITR)
2. ⚠️ Implement read replicas
3. ⚠️ Multi-region deployment
4. ⚠️ Automated failover testing
5. ⚠️ SOC2 compliance certification

---

## ✅ SUMMARY

**You're Protected From:**
- ✅ Database corruption (daily backups)
- ✅ Accidental deletion (restore from backup)
- ✅ Supabase outages (automatic failover)
- ✅ Hosting outages (redeploy to alternative)
- ✅ Security breaches (audit logs + backups)
- ✅ Data loss (encrypted backups, geo-distributed)

**Supabase Handles:**
- ✅ Automatic daily backups
- ✅ Encryption at rest and in transit
- ✅ Multi-AZ high availability
- ✅ Automatic failover
- ✅ 99.9% uptime SLA

**You Need To:**
- ⚠️ Monitor backups daily
- ⚠️ Test restoration quarterly
- ⚠️ Export audit logs monthly
- ⚠️ Review recovery procedures
- ⚠️ Train staff on procedures

---

**Your data is SAFE! Supabase has your back! 🛡️**
