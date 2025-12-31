// Edge Function: check-in-patient
// HIPAA Compliant: Atomic check-in with assistance tracking and audit logging

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssistanceItem {
  assistance_type: string;
  quantity?: number;
  notes?: string;
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

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (!userData || !['admin', 'staff'].includes(userData.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { patient_id, assistance_items, notes } = await req.json();

    if (!patient_id) {
      return new Response(
        JSON.stringify({ error: 'Missing patient_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!assistance_items || assistance_items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one assistance item required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify patient belongs to user's org
    const { data: patient } = await supabase
      .from('patients')
      .select('org_id, first_name, last_name, visit_count')
      .eq('id', patient_id)
      .single();

    if (!patient || patient.org_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Patient not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: existingVisit } = await supabase
      .from('visits')
      .select('id')
      .eq('patient_id', patient_id)
      .eq('org_id', user.id)
      .gte('check_in_timestamp', today.toISOString())
      .maybeSingle();

    if (existingVisit) {
      return new Response(
        JSON.stringify({ error: 'Patient already checked in today' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() 
                     || req.headers.get('x-real-ip')
                     || 'unknown';

    // Create visit record
    const { data: visit, error: visitError } = await supabase
      .from('visits')
      .insert({
        patient_id,
        org_id: user.id,
        staff_user_id: user.id,
        check_in_timestamp: new Date().toISOString(),
        visit_notes: notes || null,
      })
      .select()
      .single();

    if (visitError) {
      console.error('Failed to create visit:', visitError);
      return new Response(
        JSON.stringify({ error: 'Failed to create visit', details: visitError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create assistance items
    const assistanceData = (assistance_items as AssistanceItem[]).map(item => ({
      visit_id: visit.id,
      patient_id,
      org_id: user.id,
      provided_by_user_id: user.id,
      assistance_type: item.assistance_type,
      quantity: item.quantity || 1,
      notes: item.notes || null,
      provided_at: new Date().toISOString(),
    }));

    const { error: assistanceError } = await supabase
      .from('assistance_items')
      .insert(assistanceData);

    if (assistanceError) {
      console.error('Failed to create assistance items:', assistanceError);
      // Rollback visit
      await supabase.from('visits').delete().eq('id', visit.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create assistance items', details: assistanceError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update patient visit count and last visit date
    const { error: patientUpdateError } = await supabase
      .from('patients')
      .update({
        visit_count: (patient.visit_count || 0) + 1,
        last_visit_date: new Date().toISOString(),
      })
      .eq('id', patient_id)
      .eq('org_id', user.id);

    if (patientUpdateError) {
      console.error('Failed to update patient visit count:', patientUpdateError);
    }

    // Log successful check-in
    await supabase.from('audit_logs').insert({
      event_type: 'VISIT_CREATED',
      action: 'Patient checked in',
      success: true,
      user_id: user.id,
      user_email: user.email,
      resource_type: 'visit',
      resource_id: visit.id,
      ip_address: clientIP,
      user_agent: req.headers.get('user-agent'),
      details: {
        patient_id,
        patient_name: `${patient.first_name} ${patient.last_name}`,
        assistance_count: assistance_items.length,
        assistance_types: assistance_items.map((i: AssistanceItem) => i.assistance_type),
        staff_name: userData.full_name,
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        visit_id: visit.id,
        message: 'Patient checked in successfully'
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
