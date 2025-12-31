import { supabase } from '@/lib/supabase';

export interface PendingTask {
  id: string;
  patient_id: string;
  task_type: 'upload_medical_release' | 'renew_medical_release' | 'update_patient_info' | 'other';
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string | null;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  created_by: string | null;
  notes: string | null;
}

export interface CreateTaskParams {
  patientId: string;
  taskType: PendingTask['task_type'];
  title: string;
  description?: string;
  priority?: PendingTask['priority'];
  dueDate?: string;
}

export interface CompleteTaskData {
  uploadedDocumentId?: string;
  medicalStaffData?: Record<string, unknown>;
  notes?: string;
}

export const taskService = {
  /**
   * Create a new pending task
   */
  async createTask(params: CreateTaskParams): Promise<{ success: boolean; task?: PendingTask; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('pending_tasks')
        .insert({
          patient_id: params.patientId,
          task_type: params.taskType,
          title: params.title,
          description: params.description || null,
          priority: params.priority || 'medium',
          due_date: params.dueDate || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating task:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Task created:', data.id);
      return { success: true, task: data };
    } catch (error) {
      console.error('❌ Unexpected error in createTask:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Get all pending tasks, optionally filtered by patient
   */
  async getPendingTasks(patientId?: string): Promise<{ success: boolean; tasks?: PendingTask[]; error?: string }> {
    try {
      let query = supabase
        .from('pending_tasks')
        .select('*')
        .neq('status', 'completed')
        .neq('status', 'cancelled')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching tasks:', error);
        return { success: false, error: error.message };
      }

      return { success: true, tasks: data };
    } catch (error) {
      console.error('❌ Unexpected error in getPendingTasks:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Get all tasks for a patient (including completed)
   */
  async getAllTasksForPatient(patientId: string): Promise<{ success: boolean; tasks?: PendingTask[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('pending_tasks')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching patient tasks:', error);
        return { success: false, error: error.message };
      }

      return { success: true, tasks: data };
    } catch (error) {
      console.error('❌ Unexpected error in getAllTasksForPatient:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Update task status
   */
  async updateTaskStatus(
    taskId: string,
    status: PendingTask['status']
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pending_tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error updating task status:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Task status updated:', taskId, status);
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in updateTaskStatus:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Complete a task
   */
  async completeTask(
    taskId: string,
    data: CompleteTaskData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('pending_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completed_by: user.id,
          notes: data.notes || null,
        })
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error completing task:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Task completed:', taskId);
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in completeTask:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Cancel a task
   */
  async cancelTask(taskId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('pending_tasks')
        .update({ status: 'cancelled' })
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error cancelling task:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Task cancelled:', taskId);
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in cancelTask:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Check for expired disclosure forms and create renewal tasks
   * This should be run daily via a cron job or edge function
   */
  async checkExpiredForms(): Promise<{ success: boolean; tasksCreated?: number; error?: string }> {
    try {
      console.log('🔍 Checking for expired disclosure forms...');

      // Find all documents that have expired and don't have a renewal task yet
      const { data: expiredDocs, error: fetchError } = await supabase
        .from('patient_documents')
        .select('*, patients(id, first_name, last_name)')
        .eq('document_type', 'disclosure_form')
        .lte('expires_at', new Date().toISOString())
        .eq('renewal_task_created', false);

      if (fetchError) {
        console.error('❌ Error fetching expired documents:', fetchError);
        return { success: false, error: fetchError.message };
      }

      if (!expiredDocs || expiredDocs.length === 0) {
        console.log('✅ No expired forms found');
        return { success: true, tasksCreated: 0 };
      }

      console.log(`📋 Found ${expiredDocs.length} expired forms`);

      let tasksCreated = 0;

      for (const doc of expiredDocs) {
        const patient = doc.patients as { id: string; first_name: string; last_name: string };
        
        // Create renewal task
        const taskResult = await this.createTask({
          patientId: patient.id,
          taskType: 'renew_medical_release',
          title: `URGENT: Renew medical release for ${patient.first_name} ${patient.last_name}`,
          description: `Medical release form expired. Generate new form, send to provider, and upload signed copy.`,
          priority: 'urgent',
        });

        if (taskResult.success) {
          // Mark document as having renewal task created
          await supabase
            .from('patient_documents')
            .update({ renewal_task_created: true })
            .eq('id', doc.id);

          tasksCreated++;
        }
      }

      console.log(`✅ Created ${tasksCreated} renewal tasks`);
      return { success: true, tasksCreated };
    } catch (error) {
      console.error('❌ Unexpected error in checkExpiredForms:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Get task counts by status
   */
  async getTaskCounts(): Promise<{ success: boolean; counts?: Record<string, number>; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('pending_tasks')
        .select('status');

      if (error) {
        console.error('❌ Error fetching task counts:', error);
        return { success: false, error: error.message };
      }

      const counts = data.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { success: true, counts };
    } catch (error) {
      console.error('❌ Unexpected error in getTaskCounts:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
};
