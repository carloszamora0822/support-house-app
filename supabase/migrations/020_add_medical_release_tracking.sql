-- Migration 020: Add medical release tracking and pending tasks system
-- This enables two-way workflow: send form → wait → receive signed form → enter data

-- Add medical release tracking to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS has_received_medical_release BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS medical_release_sent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS medical_release_received_date TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN patients.has_received_medical_release IS 'TRUE when signed medical release form has been received and data entered';
COMMENT ON COLUMN patients.medical_release_sent_date IS 'Date when pre-filled form was sent to medical provider';
COMMENT ON COLUMN patients.medical_release_received_date IS 'Date when signed form was received and processed';

-- Create pending_tasks table for staff task management
CREATE TABLE IF NOT EXISTS pending_tasks (
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
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pending_tasks_patient_id ON pending_tasks(patient_id);
CREATE INDEX IF NOT EXISTS idx_pending_tasks_status ON pending_tasks(status);
CREATE INDEX IF NOT EXISTS idx_pending_tasks_due_date ON pending_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_pending_tasks_type ON pending_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_pending_tasks_priority ON pending_tasks(priority);

-- Enable RLS
ALTER TABLE pending_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for pending_tasks
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

CREATE POLICY "Users can delete pending_tasks"
  ON pending_tasks FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_pending_tasks_updated_at
  BEFORE UPDATE ON pending_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add column to patient_documents to track if renewal task has been created
ALTER TABLE patient_documents
ADD COLUMN IF NOT EXISTS renewal_task_created BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN patient_documents.renewal_task_created IS 'TRUE when automatic renewal task has been created for expired document';

-- Add helpful comments
COMMENT ON TABLE pending_tasks IS 'Staff task management system for tracking pending actions (upload forms, renewals, updates)';
COMMENT ON COLUMN pending_tasks.task_type IS 'Type of task: upload_medical_release, renew_medical_release, update_patient_info, other';
COMMENT ON COLUMN pending_tasks.priority IS 'Task priority: low, medium, high, urgent';
COMMENT ON COLUMN pending_tasks.status IS 'Task status: pending, in_progress, completed, cancelled';
