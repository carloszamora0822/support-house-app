// Supabase Edge Function for Audit Logging with IP Tracking
// HIPAA Compliance: Server-side audit logging with real IP addresses

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditLogRequest {
  event_type: string;
  action: string;
  success: boolean;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  user_agent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the real client IP address
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() 
                     || req.headers.get('x-real-ip')
                     || 'unknown';

    // Parse request body
    const body: AuditLogRequest = await req.json();

    // Insert audit log with real IP address
    const { error: insertError } = await supabase
      .from('audit_logs')
      .insert({
        event_type: body.event_type,
        action: body.action,
        success: body.success,
        user_id: body.user_id || user.id,
        user_email: body.user_email || user.email,
        user_name: body.user_name,
        resource_type: body.resource_type,
        resource_id: body.resource_id,
        ip_address: clientIP, // Real IP address captured server-side
        user_agent: body.user_agent,
        details: body.details,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Failed to insert audit log:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create audit log', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Audit log created',
        ip_address: clientIP // Return IP for debugging (remove in production)
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
