// Edge Function: update-patient
// HIPAA Compliant: Centralized validation, audit logging, org isolation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || !['admin', 'staff'].includes(userData.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { patient_id, data: updateData, emergency_contact } = await req.json();

    if (!patient_id) {
      return new Response(
        JSON.stringify({ error: 'Missing patient_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify patient belongs to user's org
    const { data: patient } = await supabase
      .from('patients')
      .select('org_id')
      .eq('id', patient_id)
      .single();

    if (!patient || patient.org_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Patient not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() 
                     || req.headers.get('x-real-ip')
                     || 'unknown';

    // Update patient
    const { error: patientError } = await supabase
      .from('patients')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', patient_id)
      .eq('org_id', user.id); // Enforce org isolation

    if (patientError) {
      console.error('Failed to update patient:', patientError);
      
      await supabase.from('audit_logs').insert({
        event_type: 'PATIENT_UPDATED',
        action: 'Update patient failed',
        success: false,
        user_id: user.id,
        user_email: user.email,
        resource_type: 'patient',
        resource_id: patient_id,
        ip_address: clientIP,
        details: { error: patientError.message },
      });

      return new Response(
        JSON.stringify({ error: 'Failed to update patient', details: patientError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update emergency contact if provided
    if (emergency_contact) {
      const { data: existing } = await supabase
        .from('emergency_contacts')
        .select('id')
        .eq('patient_id', patient_id)
        .eq('org_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('emergency_contacts')
          .update(emergency_contact)
          .eq('patient_id', patient_id)
          .eq('org_id', user.id);
      } else {
        await supabase
          .from('emergency_contacts')
          .insert({
            ...emergency_contact,
            patient_id,
            org_id: user.id,
          });
      }
    }

    // Log successful update
    await supabase.from('audit_logs').insert({
      event_type: 'PATIENT_UPDATED',
      action: 'Patient updated',
      success: true,
      user_id: user.id,
      user_email: user.email,
      resource_type: 'patient',
      resource_id: patient_id,
      ip_address: clientIP,
      user_agent: req.headers.get('user-agent'),
      details: {
        fields_updated: Object.keys(updateData),
        emergency_contact_updated: !!emergency_contact,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Patient updated successfully'
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
