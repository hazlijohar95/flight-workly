
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHIP_API_KEY = Deno.env.get('CHIP_API_KEY');
const CHIP_API_URL = 'https://gate.chip-in.asia/api/v1';

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
      case 'create-payment': {
        const { 
          jobId, 
          bidId, 
          amount, 
          currency, 
          buyerName, 
          buyerEmail, 
          reference 
        } = requestData;
        
        // Calculate platform fee (5%)
        const feeAmount = parseFloat((amount * 0.05).toFixed(2));
        const totalAmount = amount + feeAmount;
        
        // Create payment request to Chip
        const chipResponse = await fetch(`${CHIP_API_URL}/purchases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHIP_API_KEY}`,
          },
          body: JSON.stringify({
            purchase: {
              purchase_amount: totalAmount,
              currency: currency,
              platform_fee: feeAmount,
              reference: reference,
              product: {
                name: `Payment for job: ${reference}`,
                description: `Job payment including platform fee of ${feeAmount} ${currency}`,
              },
              buyer: {
                email: buyerEmail,
                name: buyerName,
                phone: "",
              },
              success_redirect: `${url.origin}/dashboard/jobs/${jobId}/payment-success`,
              failure_redirect: `${url.origin}/dashboard/jobs/${jobId}/payment-failed`,
              send_receipt: true,
            }
          }),
        });
        
        const chipData = await chipResponse.json();
        
        if (!chipResponse.ok) {
          console.error('Chip API error:', chipData);
          return new Response(JSON.stringify({ error: 'Failed to create payment', details: chipData }), 
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        // Store transaction in database
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            job_id: jobId,
            bid_id: bidId,
            amount: amount,
            fee_amount: feeAmount,
            currency: currency,
            payer_id: user.id,
            payee_id: requestData.payeeId,
            chip_transaction_id: chipData.id,
            status: 'pending'
          });
        
        if (transactionError) {
          console.error('Transaction insert error:', transactionError);
          return new Response(JSON.stringify({ error: 'Failed to record transaction', details: transactionError }), 
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        // Update job payment status
        const { error: jobUpdateError } = await supabase
          .from('jobs')
          .update({ payment_status: 'processing' })
          .eq('id', jobId);
        
        if (jobUpdateError) {
          console.error('Job update error:', jobUpdateError);
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          payment_url: chipData.checkout_url,
          transaction_id: chipData.id 
        }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      case 'check-payment-status': {
        const { chipTransactionId } = requestData;
        
        const chipResponse = await fetch(`${CHIP_API_URL}/purchases/${chipTransactionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${CHIP_API_KEY}`,
          },
        });
        
        const chipData = await chipResponse.json();
        
        if (!chipResponse.ok) {
          return new Response(JSON.stringify({ error: 'Failed to check payment status', details: chipData }), 
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        // Update transaction status in database
        if (chipData.status === 'paid') {
          const { data: transactionData, error: transactionError } = await supabase
            .from('transactions')
            .update({ status: 'completed' })
            .eq('chip_transaction_id', chipTransactionId)
            .select('job_id')
            .single();
          
          if (transactionError) {
            console.error('Transaction update error:', transactionError);
          } else if (transactionData) {
            // Update job payment status
            const { error: jobUpdateError } = await supabase
              .from('jobs')
              .update({ payment_status: 'paid' })
              .eq('id', transactionData.job_id);
            
            if (jobUpdateError) {
              console.error('Job update error:', jobUpdateError);
            }
          }
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          payment_status: chipData.status
        }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      case 'release-payment': {
        const { transactionId, jobId } = requestData;
        
        // Mark transaction as released
        const { error: transactionError } = await supabase
          .from('transactions')
          .update({ 
            status: 'released', 
            escrow_released_at: new Date().toISOString() 
          })
          .eq('id', transactionId);
        
        if (transactionError) {
          console.error('Transaction update error:', transactionError);
          return new Response(JSON.stringify({ error: 'Failed to release payment', details: transactionError }), 
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        // Update job status
        const { error: jobUpdateError } = await supabase
          .from('jobs')
          .update({ status: 'complete' })
          .eq('id', jobId);
        
        if (jobUpdateError) {
          console.error('Job update error:', jobUpdateError);
          return new Response(JSON.stringify({ error: 'Failed to update job status', details: jobUpdateError }), 
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        return new Response(JSON.stringify({ success: true }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
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
