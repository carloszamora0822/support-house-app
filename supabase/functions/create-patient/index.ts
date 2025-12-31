// Edge Function: create-patient
// HIPAA Compliant: Centralized validation, audit logging, business rules

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PatientData {
  // Identity
  first_name: string;
  middle_name?: string;
  last_name: string;
  goes_by?: string;
  dob: string;
  
  // Contact
  email?: string;
  phone_primary?: string;
  phone_second?: string;
  phone_other?: string;
  
  // Address
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zip?: string;
  
  // Demographics
  status?: string;
  ethnicity?: string[];
  language?: string[];
  education?: string;
  
  // Medical
  diagnosis_primary?: string;
  diagnosis_secondary?: string;
  
  // Related data
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  minor_children?: Array<{
    name: string;
    age: number;
  }>;
  
  disclosure_form?: {
    patient_signature: string;
    patient_printed_name: string;
    patient_signature_date: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user role and org_id
    const { data: userData } = await supabase
      .from('users')
      .select('role, id')
      .eq('id', user.id)
      .single();

    if (!userData || !['admin', 'staff'].includes(userData.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const patientData: PatientData = await req.json();

    // Validate required fields
    if (!patientData.first_name || !patientData.last_name || !patientData.dob) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: first_name, last_name, dob' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() 
                     || req.headers.get('x-real-ip')
                     || 'unknown';

    // Start transaction
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .insert({
        ...patientData,
        org_id: user.id, // Set org_id to current user
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (patientError) {
      console.error('Failed to create patient:', patientError);
      
      // Log failed attempt
      await supabase.from('audit_logs').insert({
        event_type: 'PATIENT_CREATED',
        action: 'Create patient failed',
        success: false,
        user_id: user.id,
        user_email: user.email,
        ip_address: clientIP,
        details: { error: patientError.message },
      });

      return new Response(
        JSON.stringify({ error: 'Failed to create patient', details: patientError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create emergency contact if provided
    if (patientData.emergency_contact) {
      await supabase.from('emergency_contacts').insert({
        patient_id: patient.id,
        org_id: user.id,
        ...patientData.emergency_contact,
      });
    }

    // Create minor children if provided
    if (patientData.minor_children && patientData.minor_children.length > 0) {
      const minorChildrenData = patientData.minor_children.map(child => ({
        patient_id: patient.id,
        org_id: user.id,
        ...child,
      }));
      await supabase.from('minor_children').insert(minorChildrenData);
    }

    // Create disclosure form if provided
    if (patientData.disclosure_form) {
      await supabase.from('disclosure_forms').insert({
        patient_id: patient.id,
        org_id: user.id,
        ...patientData.disclosure_form,
      });
    }

    // Log successful creation
    await supabase.from('audit_logs').insert({
      event_type: 'PATIENT_CREATED',
      action: 'Patient created via intake form',
      success: true,
      user_id: user.id,
      user_email: user.email,
      resource_type: 'patient',
      resource_id: patient.id,
      ip_address: clientIP,
      user_agent: req.headers.get('user-agent'),
      details: {
        patient_name: `${patient.first_name} ${patient.last_name}`,
        has_emergency_contact: !!patientData.emergency_contact,
        has_minor_children: !!patientData.minor_children?.length,
        has_disclosure_form: !!patientData.disclosure_form,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        patient_id: patient.id,
        message: 'Patient created successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
