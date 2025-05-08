
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { corsHeaders } from "./lib/cors.ts";
import { handleCreatePayment } from "./handlers/createPayment.ts";
import { handleCheckPaymentStatus } from "./handlers/checkPaymentStatus.ts";
import { handleReleasePayment } from "./handlers/releasePayment.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Parse the request body
    const requestData = await req.json();
    
    // Process based on the action
    switch (action) {
      case 'create-payment':
        return await handleCreatePayment(req, supabase, user, requestData, corsHeaders);
      
      case 'check-payment-status':
        return await handleCheckPaymentStatus(req, supabase, user, requestData, corsHeaders);
      
      case 'release-payment':
        return await handleReleasePayment(req, supabase, user, requestData, corsHeaders);
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
