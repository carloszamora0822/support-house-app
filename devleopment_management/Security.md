Healthcare application with multi-step patient intake, visit tracking, search, and HIPAA compliance. Key entry points: user login with rate limiting [1b], patient intake form submission creating multiple related records [2c], visit check-in triggering automatic patient stats updates [4d], and PHI encryption before localStorage [6b].

AI generated guide
Motivation
Healthcare applications handling Protected Health Information (PHI) face a critical security challenge: unauthorized access through brute force attacks and session hijacking. A cancer support house managing patient data must prevent attackers from guessing passwords while ensuring legitimate staff can access patient records quickly. The authentication system implements multiple defensive layers to meet HIPAA compliance requirements: rate limiting to stop brute force attacks, automatic session timeouts for unattended workstations, and comprehensive audit logging to track who accessed what data and when.

Details
Login Flow with Security Controls
The authentication process begins with client-side validation using a Zod schema [1a] that checks email format and password presence before making any network requests. This prevents unnecessary API calls and provides immediate user feedback.

When credentials are submitted, the system first checks if the account is locked out [1b] using rateLimiter.isLockedOut(). After 5 failed login attempts, accounts are automatically locked for 15 minutes to prevent brute force attacks. This is a critical HIPAA security control.

If the account isn't locked, the system calls Supabase authentication [1c] which validates credentials and generates a JWT token. Supabase handles password hashing with bcrypt and manages the authentication session.

After successful authentication, the system fetches the user record [1d] from the users table to retrieve the user's role (admin, staff, or viewer). This role determines what data the user can access through Row Level Security policies.

HIPAA Compliance Requirements
Every login attempt—successful or failed—is logged to the audit_logs table [1e] with timestamp, user email, and outcome. This audit trail is a HIPAA requirement for tracking access to PHI and investigating security incidents.

Finally, the system initializes session management [1f] by calling sessionManager.reset(), which starts a 15-minute inactivity timer. If the user doesn't interact with the application for 15 minutes, they're automatically logged out. This prevents unauthorized access when staff leave workstations unattended—another HIPAA requirement.

Rate Limiting Implementation
The rate limiter tracks failed attempts in localStorage with a 15-minute sliding window. When an account reaches 5 failed attempts, it's locked until the window expires. Successful logins clear the failed attempt counter and any existing lockout.

User Authentication Flow
LoginForm Component
1a
Login validation schema
LoginForm.tsx:10
const loginSchema = z.object({
onSubmit()
authService.login()
1b
Rate limiting check
authService.ts:11
if (rateLimiter.isLockedOut(credentials.email)) {
rateLimiter.isLockedOut()
1c
Supabase authentication
authService.ts:26
const { data, error } = await supabase.auth.signInWithPassword({
signInWithPassword()
1d
User record fetch
authService.ts:52
const { data: userData, error: userError } = await supabase
supabase.from('users').select()
1e
Audit log creation
authService.ts:71
await auditLogger.logAuth('LOGIN', credentials.email, true, {
auditLogger.logAuth()
Insert to audit_logs table
1f
Session initialization
authService.ts:77
sessionManager.reset();
sessionManager.reset()
Start 15min timeout timer

AI generated guide
Motivation
Cancer support houses need to register new patients with extensive information—identity, demographics, medical history, emergency contacts, family details, and legal disclosures—while simultaneously creating their first visit record and generating paperwork for medical providers. This multi-step intake form must create up to 10 different database records atomically, validate conditional requirements (e.g., guardian info for children, spouse details for married patients), and generate a PDF disclosure form that gets faxed to oncologists—all while maintaining HIPAA compliance and data integrity.

Details
Form Validation and Submission
The intake process starts with three-step validation [2a] using Zod schemas that enforce required fields, phone number formats, and conditional logic (guardian required when status='child', spouse required when married). When staff clicks submit [2b], the form data flows into intakeService.submitIntakeForm which orchestrates the entire transaction.

Multi-Record Creation Sequence
The service first authenticates the current user, then creates the patient record [2c] with all identity, demographic, and medical information. Immediately after, it creates an initial visit record [2d] marked as type 'intake'—this is critical because a database trigger automatically increments the patient's visit_count and sets last_visit_date.

Related Records Cascade
The service then creates related records conditionally: emergency contacts [2e] if provided, minor children if any exist in the household, surgery/chemo/radiation records for treatment history, and physician records [2f] for all selected oncologists (Mercy, Baptist Health, or custom entries). Each insertion happens sequentially with error handling to prevent partial data states.

Document Generation and Task Management
After database records are created, the system generates a PDF [2g] of the disclosure form pre-filled with patient information, which gets uploaded to Supabase Storage. Finally, it creates a pending task [2h] for staff to upload the signed medical release once the form is returned from the medical provider—this ensures follow-up doesn't get forgotten.

Database-Level Integrity
The entire flow relies on PostgreSQL triggers that fire automatically when visits are inserted, updating patient statistics atomically. Row Level Security policies enforce that only authenticated staff/admin users can create these records, providing defense-in-depth authorization.

Patient Intake Form Submission Flow
User Interface Layer
2a
Form validation
IntakeFormContainer.tsx:157
await patientInformationSchema.parseAsync(formData.patientData);
2b
Form submission trigger
IntakeFormContainer.tsx:234
await submitForm(formData, () => {
Service Layer (intakeService.submitIntakeForm)
Get authenticated user context
2c
Patient record creation
intakeService.ts:31
const { data: patient, error: patientError } = await supabase
2d
Initial visit creation
intakeService.ts:126
const { data: visit, error: visitError } = await supabase
2e
Emergency contact insert
intakeService.ts:148
const { error: emergencyError } = await supabase
Minor children bulk insert
Surgery records creation
Chemo cycles creation
Radiation treatments creation
2f
Physician records creation
intakeService.ts:280
const { error: physicianError } = await supabase
Disclosure form record creation
2g
PDF generation
intakeService.ts:344
const pdfBlob = await pdfService.generateDisclosurePDF(formData.disclosureData);
Upload PDF to storage
2h
Task creation
intakeService.ts:375
const taskResult = await taskService.createTask({
Database Layer
Triggers fire on visit insert
Update patient stats automatically
RLS policies enforce authorization

AI generated guide
Motivation
Healthcare staff need to quickly find existing patients in a database that may contain thousands of records. The search must be fast, secure, and compliant with HIPAA regulations, which require logging all access to Protected Health Information (PHI). The system must also prevent SQL injection attacks that could expose sensitive patient data, while enforcing role-based access control to ensure only authorized staff can view patient records.

Details
Input Sanitization
The search flow begins with sanitizing user input [3a] by escaping SQL wildcard characters (% and _) that could be exploited for injection attacks. This prevents malicious users from crafting queries that bypass security controls or access unauthorized data.

Query Construction
The system uses Supabase's query builder [3b] which internally uses parameterized queries, providing an additional layer of SQL injection protection. The search builds OR conditions [3c] across multiple fields including first name, last name, email, phone numbers (all three fields), ZIP code, and city, allowing staff to find patients using any identifying information they remember.

Authorization Layer
When the query executes [3d], Row Level Security (RLS) policies automatically enforce authorization at the database level. The policy checks if the authenticated user has an admin, staff, or viewer role before returning any patient records. This ensures that even if application-level security is bypassed, the database itself prevents unauthorized access.

Audit Compliance
Every search is logged to the audit_logs table [3e] with the user's identity, search term (truncated for privacy), and result count. This audit trail is a HIPAA requirement that enables compliance reporting and investigation of potential data breaches or unauthorized access attempts.

Patient Search Flow
User Input in Search Component
searchService.quickSearch() called
3a
Input sanitization
searchService.ts:68
const sanitizedTerm = term.replace(/[%_]/g, '\\$&').trim();
Escapes SQL wildcards (%, _)
3b
Query initialization
searchService.ts:73
const query = supabase.from('patients').select('*');
supabase.from('patients').select()
3c
Search condition building
searchService.ts:79
orConditions.push(`first_name.ilike.%${searchTerm}%`);
first_name.ilike pattern
last_name.ilike pattern
email.ilike pattern
phone fields.ilike pattern
zip/city matches
3d
Query execution
searchService.ts:103
const { data, error } = await query
RLS policy checks user role
Returns filtered results
3e
Search audit logging
auditLogger.ts:219
await this.log('PATIENT_SEARCHED', 'Patient search performed', {
Log to audit_logs table

AI generated guide
Motivation
In a cancer support house, staff need to track every time a patient physically visits the facility. This data is critical for grant reporting and understanding patient engagement. The system must prevent duplicate check-ins on the same day, automatically maintain accurate visit counts, and ensure the patient's "last visit date" stays current—all without requiring staff to manually update statistics.

The challenge: maintaining data consistency across multiple tables (visits and patients) while preventing race conditions when multiple staff members might check in patients simultaneously.

Details
Check-in Process
When staff clicks "Check In This Patient," the system executes visitService.checkInPatient() [4c], which performs three critical operations in sequence:

Duplicate Prevention [4a]: Queries the visits table to check if the patient already has a check-in timestamp for today. If found, the operation fails with an error message, preventing inflated visit counts.

Visit Type Detection [4b]: Determines whether this is the patient's first-ever visit (intake) or a returning visit by checking for existing visit records. This classification is important for analytics and reporting.

Visit Record Creation [4c]: Inserts a new record into the visits table with the current timestamp, staff member ID, and any assistance requested (food, medical supplies, etc.).

Automatic Stats Update
The key to data consistency is a PostgreSQL trigger that fires immediately after the visit insert [4d]. The trigger_update_patient_visit_stats function executes two atomic updates on the patients table:

Increments visit_count [4e]: Uses visit_count = visit_count + 1 to atomically increment without race conditions
Updates last_visit_date [4f]: Sets to the date portion of the check-in timestamp
This trigger-based approach ensures the patient statistics are always synchronized with the visits table, even if the application crashes or multiple check-ins happen concurrently. The database guarantees consistency through its transaction isolation.

Why Triggers Matter
Without the trigger, the application would need to manually update patient stats after creating each visit. This creates opportunities for:

Stats getting out of sync if the update fails
Race conditions if two staff members check in different patients simultaneously
Incorrect counts if the application crashes between operations
The trigger moves this logic to the database layer where PostgreSQL's ACID guarantees ensure correctness.

Visit Check-in Flow
Staff initiates check-in
visitService.checkInPatient()
4a
Duplicate check
visitService.ts:27
const alreadyCheckedIn = await this.isAlreadyCheckedInToday(input.patient_id);
isAlreadyCheckedInToday()
4b
First visit detection
visitService.ts:33
const { data: existingVisits } = await supabase
Query existing visits
4c
Visit record insertion
visitService.ts:53
const { data: visit, error: visitError } = await supabase
supabase.from('visits').insert()
Database trigger fires
trigger_update_patient_visit_stats
4d
Trigger execution
009_create_triggers.sql:5
UPDATE patients
4e
Visit count increment
009_create_triggers.sql:7
visit_count = visit_count + 1,
4f
Last visit date update
009_create_triggers.sql:8
last_visit_date = DATE(NEW.check_in_timestamp)
Visit created, patient stats updated

AI generated guide
Motivation
Healthcare applications handling Protected Health Information (PHI) must prevent invalid or incomplete data from entering the system. A cancer support house intake form collects sensitive patient information across multiple steps—identity, demographics, medical history, and legal disclosures. Without proper validation, staff could accidentally submit forms missing critical fields like guardian information for child patients or spouse details for married patients, leading to incomplete records that violate data integrity requirements and potentially HIPAA compliance.

The validation system solves this by enforcing required fields, format constraints, and conditional logic before allowing form progression, ensuring every patient record is complete and accurate from the moment of creation.

Details
Validation Architecture
The system uses Zod schemas for type-safe validation with custom error messages [5a]. The patientInformationSchema defines all validation rules in a single source of truth at /src/features/forms/intake/schemas/patientSchema.ts.

Three Layers of Validation
1. Basic Required Fields Standard fields like first_name, last_name, dob, and address use simple .min(1) validation [5a]. These prevent empty submissions.

2. Format Validation Phone numbers must match a 10-digit US format using regex: /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/ [5b]. This prevents malformed data like "....----" from entering the database. Email and ZIP codes have similar format constraints.

3. Conditional Cross-Field Validation The schema uses .refine() methods for context-dependent requirements [5c]:

When status === 'child', both guardian_name and guardian_relationship become required [5d]
When marital_status === 'married', spouse_name becomes required [5e]
Execution Flow
During form navigation, handleNext() validates the current step before allowing progression. The validation happens asynchronously using parseAsync(), catching errors and displaying user-friendly toast messages like "Please complete all required fields before proceeding" rather than allowing invalid data to advance.

Why This Matters
This validation architecture ensures database constraints match application logic. The NOT NULL constraints added in migration 015_add_not_null_constraints.sql mirror these Zod validations, creating defense in depth—even if client-side validation were bypassed, the database would reject invalid data.

Patient Intake Form Validation Flow
IntakeFormContainer.tsx
handleNext() - step progression
5a
Required field validation
patientSchema.ts:31
first_name: z.string().min(1, 'First name is required'),
patientInformationSchema.parseAsync()
Zod schema validation
patientSchema.ts - Validation Rules
Basic field validation
5a
Required field validation
5b
Format validation
patientSchema.ts:42
phone_primary: z.string().min(1, 'Primary phone is required').refine((val) => phoneRegex.test(val), 'Invalid phone number format (use: 555-123-4567)'),
email, zip regex validation
5c
Conditional validation start
patientSchema.ts:107
}).refine((data) => {
Guardian conditional logic
5d
Guardian requirement check
patientSchema.ts:109
if (data.status === 'child') {
require guardian_name
Spouse conditional logic
5e
Spouse requirement check
patientSchema.ts:118
if (data.marital_status === 'married') {
require spouse_name
Return validation result
Success: proceed to next step
Error: display toast message

AI generated guide
Motivation
This application handles Protected Health Information (PHI) for cancer patients, including names, dates of birth, medical diagnoses, and treatment details. Under HIPAA regulations, this data must be protected both in transit and at rest. The challenge: staff need to save draft intake forms in the browser so they can complete them later without losing work, but storing PHI in plain text in localStorage would violate HIPAA and expose sensitive patient data to anyone with access to the browser's developer tools or the file system.

The solution implements AES-256-GCM encryption for all PHI stored locally, with automatic 24-hour expiration to minimize the exposure window.

Details
Encryption Flow
When a staff member saves a draft intake form [6a], the system:

Serializes the form data to JSON [6b]
Derives an encryption key using PBKDF2 with 100,000 iterations [6c] - this makes brute force attacks computationally expensive
Generates a random initialization vector (IV) for each encryption operation to ensure the same data encrypts differently each time
Encrypts using AES-GCM [6d], which provides both confidentiality and authenticity (prevents tampering)
Stores the encrypted blob with its IV and timestamp in localStorage [6e]
Decryption and Expiration
When loading a draft, the system:

Retrieves the encrypted data from localStorage
Checks if 24 hours have elapsed [6f] - if so, the draft is automatically deleted to limit PHI exposure
Decrypts using the same key derivation process and the stored IV
Returns the original form data
Security Properties
Encryption at rest: PHI is never stored in plain text in the browser
Time-limited exposure: Drafts automatically expire after 24 hours
Authenticated encryption: AES-GCM prevents tampering with encrypted data
Unique IVs: Each encryption operation uses a fresh random IV to prevent pattern analysis
Limitations
The encryption key is derived from a hardcoded constant in the source code (ENCRYPTION_KEY = 'support-house-encryption-key-v1'), which means anyone with access to the JavaScript bundle can decrypt the data. This provides obfuscation rather than true security - it protects against casual browser inspection but not determined attackers. For production, consider using server-side storage or hardware-backed key storage.

PHI Encryption & Secure Storage Flow
Form Draft Save Request
6a
Draft save initiation
formService.ts:22
return await secureStorage.setItem(`${DRAFT_PREFIX}${formKey}`, draftData);
secureStorage.setItem()
JSON.stringify(data)
6b
Encryption call
secureStorage.ts:121
const { encrypted, iv } = await encrypt(jsonString);
crypto.subtle.importKey()
6c
Key derivation
secureStorage.ts:30
const key = await crypto.subtle.deriveKey(
PBKDF2 with 100k iterations
crypto.getRandomValues() for IV
6d
AES-GCM encryption
secureStorage.ts:47
const encrypted = await crypto.subtle.encrypt(
AES-GCM-256 encryption
Base64 encoding
6e
Encrypted storage
secureStorage.ts:129
localStorage.setItem(key, JSON.stringify(encryptedData));
Form Draft Load Request
secureStorage.getItem()
localStorage.getItem()
6f
Expiration check
secureStorage.ts:151
if (isExpired(encryptedData.timestamp)) {
Auto-delete if > 24 hours
decrypt(encrypted, iv)
Return decrypted data

AI generated guide
Motivation
Healthcare applications handling Protected Health Information (PHI) face a critical security challenge: preventing unauthorized access to patient data. In a cancer support house with multiple staff roles (admin, staff, viewer), you need database-level authorization that cannot be bypassed by application bugs or compromised credentials.

Without proper authorization, a viewer-role user could potentially modify patient records, or a staff member could delete critical data. Even worse, if the application layer is compromised, attackers could access all patient data directly through the database.

Row Level Security (RLS) solves this by enforcing authorization rules inside PostgreSQL itself [7a], making it impossible to bypass even with direct database access.

Details
How RLS Works
When RLS is enabled on the patients table [7a], PostgreSQL automatically filters every query based on policy rules before returning results. The application doesn't need to add WHERE clauses for authorization—the database handles it transparently.

Policy Structure
Each policy defines who can perform which operation on rows. The patients_select_staff_admin policy [7b] controls read access using a subquery that checks the authenticated user's role [7c].

The key mechanism: PostgreSQL extracts the user ID from the JWT token sent with each request [7d], queries the users table to find their role [7c], and only grants access if the role matches admin, staff, or viewer [7e].

Separation of Concerns
Different operations have different authorization levels. While SELECT allows viewers to read data [7e], the DELETE policy restricts deletion to admins only [7f]. This prevents accidental or malicious data loss by lower-privileged users.

Defense in Depth
RLS provides a second layer of security beyond application-level checks. Even if the React frontend or API service has a bug that bypasses role checks, the database will still enforce authorization. This is critical for HIPAA compliance, which requires multiple safeguards for PHI.

Performance Consideration
The policy subquery executes on every query, but PostgreSQL optimizes this by caching the user lookup. The auth.uid() function extracts the user ID directly from the JWT without additional database calls.

Database Query with RLS Authorization
Application Layer
supabase.from('patients').select()
Supabase Client sends query with JWT
PostgreSQL Database Layer
7a
RLS enablement
002_create_patients_table.sql:144
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
Query intercepted by RLS engine
Policy evaluation begins
7b
SELECT policy creation
002_create_patients_table.sql:147
CREATE POLICY patients_select_staff_admin ON patients
7c
Policy condition
002_create_patients_table.sql:150
EXISTS (
7d
User identity check
002_create_patients_table.sql:152
WHERE id::text = auth.uid()::text
Query users table for role
7e
Role authorization
002_create_patients_table.sql:153
AND role IN ('admin', 'staff', 'viewer')
Access granted if policy passes
Return filtered patient records
7f
DELETE policy
014_add_delete_policies.sql:10
CREATE POLICY patients_delete_admin ON patients
Restricts DELETE to admin role only

AI generated guide
Motivation
HIPAA regulations require healthcare applications to automatically log out users after 15 minutes of inactivity to prevent unauthorized access to Protected Health Information (PHI) on unattended workstations. Without this safeguard, a staff member could walk away from their computer, leaving sensitive patient data exposed to anyone passing by. The session manager [8a] implements this critical security control by monitoring user activity and enforcing automatic timeouts.

Details
Activity Tracking
The system monitors six types of user interactions [8b]: mouse movements, clicks, keypresses, scrolling, and touch events. Every time any of these events fire, the handleActivity() function [8c] updates a timestamp in localStorage recording the last moment of user activity. This creates a continuous trail of when the user was actively using the application.

Timeout Enforcement
A background timer checks every 10 seconds [8d] whether the session should expire. The checkTimeout() function calculates how much time has elapsed since the last activity. If 15 minutes pass with no activity [8e], the system triggers the logout callback, which terminates the session and redirects to the login page. This happens automatically without user intervention.

User Warning System
To prevent disruptive logouts during active work, the system shows a 2-minute warning [8f] before the timeout occurs. This gives users a chance to move their mouse or press a key to extend their session. The warning only appears once per timeout cycle to avoid notification fatigue.

Implementation Pattern
The session manager uses the observer pattern: it's initialized once at login with callback functions for timeout and warning events. The activity listeners are attached to the window object with passive: true for performance, ensuring activity tracking doesn't interfere with scrolling or other interactions. All state is persisted in localStorage so the timeout continues working even if the user switches browser tabs.

Session Management System (HIPAA Compliance)
Configuration
8a
Timeout configuration
sessionManager.ts:4
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
Initialization (sessionManager.init)
8b
Activity listener setup
sessionManager.ts:113
activityEvents.forEach(event => {
mousedown, mousemove, keypress, etc.
8d
Timeout checker
sessionManager.ts:118
checkInterval = setInterval(checkTimeout, 10000);
checkInterval every 10 seconds
User Activity Detection
handleActivity() on any event
8c
Activity timestamp update
sessionManager.ts:21
localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, Date.now().toString());
Timeout Monitoring Loop
checkTimeout() called every 10s
Calculate timeRemaining
8e
Timeout detection
sessionManager.ts:58
if (timeRemaining === 0) {
timeoutCallback() → logout
8f
Warning display
sessionManager.ts:67
if (timeRemaining <= WARNING_BEFORE_TIMEOUT_MS && !warningShown && warningCallback) {
warningCallback() → show modal
Medical Office
