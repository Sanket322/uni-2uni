import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the admin user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid authentication token');
    }

    // Check if user has admin role
    const { data: roles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError || !roles || !roles.some(r => r.role === 'admin')) {
      throw new Error('User does not have admin privileges');
    }

    const { targetUserId, action } = await req.json();

    if (!targetUserId) {
      throw new Error('Target user ID is required');
    }

    if (action === 'start') {
      // Log the impersonation event
      const { error: logError } = await supabaseClient
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: 'impersonation_started',
          activity_description: `Admin ${user.email} started impersonating user ${targetUserId}`,
          metadata: {
            admin_id: user.id,
            target_user_id: targetUserId,
            timestamp: new Date().toISOString()
          }
        });

      if (logError) {
        console.error('Failed to log impersonation:', logError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          impersonatedUserId: targetUserId,
          adminUserId: user.id,
          message: 'Impersonation started successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (action === 'stop') {
      // Log the end of impersonation
      const { error: logError } = await supabaseClient
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: 'impersonation_stopped',
          activity_description: `Admin ${user.email} stopped impersonating user ${targetUserId}`,
          metadata: {
            admin_id: user.id,
            target_user_id: targetUserId,
            timestamp: new Date().toISOString()
          }
        });

      if (logError) {
        console.error('Failed to log impersonation end:', logError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Impersonation stopped successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      throw new Error('Invalid action. Use "start" or "stop"');
    }
  } catch (error) {
    console.error('Error in impersonate-user function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during impersonation';
    return new Response(
      JSON.stringify({
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});