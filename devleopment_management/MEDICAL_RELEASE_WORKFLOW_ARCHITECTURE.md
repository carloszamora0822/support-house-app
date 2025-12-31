# Medical Release Form Workflow Architecture

## Overview
Two-way workflow for medical release forms with pending state tracking and staff task management.

---

## Complete Workflow

### Step 1: Initial Intake (4-Step Form)
```
Staff completes intake → Generate pre-filled PDF → Download/Fax to provider
                                    ↓
                    Patient created with has_received_medical_release = FALSE
                                    ↓
                        TODO created: "Upload signed medical release"
```

### Step 2: Waiting Period
```
Patient Profile shows:
┌─────────────────────────────────────┐
│ ⚠️ PENDING: Awaiting Medical Release│
│ Sent to: Baptist Health             │
│ Date sent: Dec 30, 2024             │
│ Days waiting: 5                     │
│                                     │
│ [📋 View Pending Tasks]             │
└─────────────────────────────────────┘
```

### Step 3: Staff Uploads Signed Form
```
Staff opens patient → Sees TODO → Clicks "Complete Task"
                            ↓
        ┌───────────────────────────────────────┐
        │ Upload Signed Medical Release Form    │
        ├───────────────────────────────────────┤
        │ 📎 Drag & drop PDF, JPEG, PNG here   │
        │ or click to browse                    │
        │                                       │
        │ [Uploaded: medical_release_signed.pdf]│
        │                                       │
        │ Enter Medical Staff Information:      │
        │ ┌─────────────────────────────────┐  │
        │ │ Diagnosis: Lung Cancer Stage IIIA│  │
        │ │ Expected Treatments: 18          │  │
        │ │ Treatment Start: 2024-11-01      │  │
        │ │ ... (all medical staff fields)   │  │
        │ └─────────────────────────────────┘  │
        │                                       │
        │ [Cancel] [Complete Task]              │
        └───────────────────────────────────────┘
```

### Step 4: One Year Later - Auto Renewal
```
System checks daily for expired forms
                ↓
    Form expires after 1 year
                ↓
    New TODO created automatically
                ↓
    Staff sees: "URGENT: Renew medical release for [Patient]"
                ↓
    Repeat workflow (generate → send → wait → upload → enter)
```

---

## Database Schema

### Migration 020: Add Medical Release Tracking

```sql
-- Add to patients table
ALTER TABLE patients 
ADD COLUMN has_received_medical_release BOOLEAN DEFAULT FALSE,
ADD COLUMN medical_release_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN medical_release_received_date TIMESTAMP WITH TIME ZONE;

-- Create pending_tasks table
CREATE TABLE pending_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('upload_medical_release', 'renew_medical_release', 'update_patient_info', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  notes TEXT
);

CREATE INDEX idx_pending_tasks_patient_id ON pending_tasks(patient_id);
CREATE INDEX idx_pending_tasks_status ON pending_tasks(status);
CREATE INDEX idx_pending_tasks_due_date ON pending_tasks(due_date);
CREATE INDEX idx_pending_tasks_type ON pending_tasks(task_type);

-- Enable RLS
ALTER TABLE pending_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all pending_tasks"
  ON pending_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert pending_tasks"
  ON pending_tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update pending_tasks"
  ON pending_tasks FOR UPDATE
  TO authenticated
  USING (true);
```

---

## Component Structure

### New Components

```
src/features/tasks/
├── PendingTasksList.tsx           # List all pending tasks
├── TaskCard.tsx                   # Single task card with priority badge
├── CompleteTaskModal.tsx          # Modal for completing tasks
├── UploadSignedFormSection.tsx   # Drag & drop upload
├── MedicalStaffDataEntry.tsx     # Reuse disclosure medical staff section
└── hooks/
    ├── usePendingTasks.ts        # Fetch tasks
    ├── useCompleteTask.ts        # Complete task workflow
    └── useFileUpload.ts          # Handle file upload

src/features/patients/profile/
├── PendingTasksBadge.tsx         # Show pending count on profile
├── MedicalReleaseStatus.tsx      # Show status and days waiting
└── DocumentsTab.tsx              # Show all documents with expiry
```

---

## Services

### taskService.ts
```typescript
interface TaskService {
  createTask(patientId: string, taskType: string, title: string): Promise<Task>;
  getPendingTasks(patientId?: string): Promise<Task[]>;
  completeTask(taskId: string, data: CompleteTaskData): Promise<void>;
  checkExpiredForms(): Promise<void>; // Run daily via cron
}
```

### fileUploadService.ts
```typescript
interface FileUploadService {
  uploadSignedForm(file: File, patientId: string): Promise<string>; // Returns document ID
  acceptedTypes: string[]; // ['application/pdf', 'image/jpeg', 'image/png']
  maxSize: number; // 10MB
}
```

---

## UI/UX Flow

### Patient Profile - Pending State
```
┌────────────────────────────────────────────┐
│ Michael Thompson                           │
│ DOB: 07/22/1968  |  Lung Cancer           │
├────────────────────────────────────────────┤
│ ⚠️ INCOMPLETE PROFILE                      │
│                                            │
│ Missing:                                   │
│ • Signed Medical Release Form              │
│   Sent to Baptist Health on Dec 30, 2024  │
│   Waiting 5 days                           │
│                                            │
│ [📋 Complete Pending Tasks (1)]            │
└────────────────────────────────────────────┘
```

### Task Completion Modal
```
┌─────────────────────────────────────────────┐
│ Complete Task: Upload Signed Medical Release│
├─────────────────────────────────────────────┤
│ Patient: Michael Thompson                   │
│ Form sent: Dec 30, 2024                     │
│                                             │
│ Step 1: Upload Signed Form                 │
│ ┌─────────────────────────────────────────┐ │
│ │ 📎 Drag & drop file here                │ │
│ │    or click to browse                   │ │
│ │                                         │ │
│ │ Accepts: PDF, JPEG, PNG (max 10MB)     │ │
│ └─────────────────────────────────────────┘ │
│ ✅ Uploaded: medical_release_signed.pdf     │
│                                             │
│ Step 2: Enter Medical Staff Information    │
│ ┌─────────────────────────────────────────┐ │
│ │ Diagnosis: [Lung Cancer Stage IIIA]    │ │
│ │ Stage: [Stage IIIA]                     │ │
│ │ Expected Treatments: [18]               │ │
│ │ Treatment Start: [2024-11-01]           │ │
│ │ Treatment End: [2025-03-15]             │ │
│ │ Chemo Type: [☑ IV ☑ Oral]              │ │
│ │ ... (all medical staff fields)          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Cancel] [Complete Task]                    │
└─────────────────────────────────────────────┘
```

### Dashboard - Pending Tasks Widget
```
┌────────────────────────────────────┐
│ 📋 Pending Tasks (3)               │
├────────────────────────────────────┤
│ 🔴 URGENT: Renew medical release   │
│    Jane Doe - Expired 5 days ago   │
│    [Complete]                      │
│                                    │
│ 🟡 Upload signed medical release   │
│    Michael Thompson - 5 days       │
│    [Complete]                      │
│                                    │
│ 🟢 Update patient information      │
│    Sarah Johnson                   │
│    [Complete]                      │
│                                    │
│ [View All Tasks]                   │
└────────────────────────────────────┘
```

---

## Automatic Task Creation

### Daily Cron Job (or Edge Function)
```typescript
// Check for expired forms daily
async function checkExpiredForms() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Find all documents expiring today
  const { data: expiredDocs } = await supabase
    .from('patient_documents')
    .select('*, patients(*)')
    .eq('document_type', 'disclosure_form')
    .lte('expires_at', new Date().toISOString())
    .is('renewal_task_created', null);

  for (const doc of expiredDocs) {
    // Create renewal task
    await taskService.createTask(
      doc.patient_id,
      'renew_medical_release',
      `URGENT: Renew medical release for ${doc.patients.first_name} ${doc.patients.last_name}`,
      'urgent'
    );

    // Mark document as having renewal task created
    await supabase
      .from('patient_documents')
      .update({ renewal_task_created: true })
      .eq('id', doc.id);
  }
}
```

---

## Implementation Phases

### Phase 1: Database & Task System
- Add medical release tracking columns to patients
- Create pending_tasks table
- Create taskService

### Phase 2: File Upload
- Build drag & drop component
- Integrate with documentService
- Support PDF, JPEG, PNG

### Phase 3: Task Completion Workflow
- Build CompleteTaskModal
- Integrate file upload + data entry
- Update patient record on completion

### Phase 4: UI Integration
- Add pending tasks badge to patient profile
- Create pending tasks list page
- Add dashboard widget

### Phase 5: Automatic Renewal
- Set up daily check for expired forms
- Auto-create renewal tasks
- Email notifications (optional)

---

## Key Features

✅ **Two-way workflow**: Send form → Wait → Receive form  
✅ **Pending state tracking**: Clear visibility of incomplete profiles  
✅ **Staff task management**: Organized TODO list  
✅ **Drag & drop upload**: Easy file upload (PDF/images)  
✅ **Reusable components**: Medical staff section from disclosure form  
✅ **Automatic renewal**: 1-year expiry with auto-task creation  
✅ **Priority system**: Urgent/High/Medium/Low  
✅ **Audit trail**: Track who completed tasks and when  

This is a complete, production-ready workflow! 🚀
