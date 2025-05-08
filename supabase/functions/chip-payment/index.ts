import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CHIP_API_KEY = Deno.env.get('CHIP_API_KEY');
const CHIP_API_SECRET = Deno.env.get('CHIP_API_SECRET');
const CHIP_API_URL = 'https://gate.chip-in.asia/api/v1';
const CHIP_SEND_API_URL = 'https://staging-api.chip-in.asia/api/'; // Using staging URL for development

async function generateChecksum(epoch: number): Promise<string> {
  if (!CHIP_API_KEY || !CHIP_API_SECRET) {
    throw new Error('Missing CHIP API credentials');
  }
  
  const data = `${epoch}${CHIP_API_KEY}`;
  
  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const secretBuffer = encoder.encode(CHIP_API_SECRET);
  
  // Create HMAC using SHA-512
  const key = await crypto.subtle.importKey(
    "raw",
    secretBuffer,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, dataBuffer);
  
  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

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
        
        // Get transaction details
        const { data: transactionData, error: transactionQueryError } = await supabase
          .from('transactions')
          .select('*, bids(*)')
          .eq('id', transactionId)
          .single();
        
        if (transactionQueryError || !transactionData) {
          console.error('Transaction query error:', transactionQueryError);
          return new Response(JSON.stringify({ error: 'Failed to fetch transaction data', details: transactionQueryError }), 
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        // Get freelancer profile for bank details (in a real implementation, you'd store bank details)
        const { data: freelancerData, error: freelancerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', transactionData.payee_id)
          .single();
        
        if (freelancerError) {
          console.error('Freelancer profile query error:', freelancerError);
          return new Response(JSON.stringify({ error: 'Failed to fetch freelancer data', details: freelancerError }), 
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        try {
          // Generate epoch and checksum for CHIP Send API
          const epoch = Math.floor(Date.now() / 1000);
          const checksum = await generateChecksum(epoch);
          
          // Call CHIP Send API to disburse funds
          // For this example, we're using the Add Bank Account API first
          // In a real implementation, you would have stored the bank account details
          
          // 1. First, check available balance
          const accountsResponse = await fetch(`${CHIP_SEND_API_URL}accounts`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${CHIP_API_KEY}`,
              'epoch': epoch.toString(),
              'checksum': checksum
            }
          });
          
          const accountsData = await accountsResponse.json();
          console.log('Accounts API response:', accountsData);
          
          // 2. Add a bank account (in production, you'd store these)
          // For simplicity, we're adding a test bank account each time
          const bankAccountResponse = await fetch(`${CHIP_SEND_API_URL}bank_accounts`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CHIP_API_KEY}`,
              'epoch': epoch.toString(),
              'checksum': checksum
            },
            body: JSON.stringify({
              bank_account: {
                account_name: `${freelancerData.first_name} ${freelancerData.last_name}`,
                account_number: "1234567890", // In production, fetch from secured storage
                bank_code: "MBBEMYKL",  // Maybank
                reference: `Payment for job ${jobId}`
              }
            })
          });
          
          const bankAccountData = await bankAccountResponse.json();
          console.log('Bank account API response:', bankAccountData);
          
          if (!bankAccountData.id) {
            throw new Error('Failed to add bank account: ' + JSON.stringify(bankAccountData));
          }
          
          // 3. Create send instruction
          const sendInstructionResponse = await fetch(`${CHIP_SEND_API_URL}send_instructions`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CHIP_API_KEY}`,
              'epoch': epoch.toString(),
              'checksum': checksum
            },
            body: JSON.stringify({
              send_instruction: {
                amount: transactionData.amount,
                bank_account_id: bankAccountData.id,
                remarks: `Payment for job: ${jobId}`,
                reference: `job-payment-${jobId}`,
                currency: transactionData.currency || "MYR"
              }
            })
          });
          
          const sendInstructionData = await sendInstructionResponse.json();
          console.log('Send instruction API response:', sendInstructionData);
          
          if (!sendInstructionData.id) {
            throw new Error('Failed to create send instruction: ' + JSON.stringify(sendInstructionData));
          }
          
          // Update transaction status to disbursed
          const { error: transactionUpdateError } = await supabase
            .from('transactions')
            .update({ 
              status: 'disbursed', 
              escrow_released_at: new Date().toISOString(),
              disbursed_at: new Date().toISOString(),
              chip_send_transaction_id: sendInstructionData.id
            })
            .eq('id', transactionId);
          
          if (transactionUpdateError) {
            console.error('Transaction update error:', transactionUpdateError);
            return new Response(JSON.stringify({ error: 'Failed to update transaction status', details: transactionUpdateError }), 
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          
          // Update job status
          const { error: jobUpdateError } = await supabase
            .from('jobs')
            .update({ status: 'complete', payment_status: 'released' })
            .eq('id', jobId);
          
          if (jobUpdateError) {
            console.error('Job update error:', jobUpdateError);
            return new Response(JSON.stringify({ error: 'Failed to update job status', details: jobUpdateError }), 
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          
          return new Response(JSON.stringify({ 
            success: true,
            send_instruction_id: sendInstructionData.id,
            status: sendInstructionData.status
          }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          
        } catch (chipError) {
          console.error('CHIP Send API error:', chipError);
          
          // Still mark transaction as released but with an error flag
          const { error: transactionUpdateError } = await supabase
            .from('transactions')
            .update({ 
              status: 'released', // We still release it in our system even if CHIP Send failed
              escrow_released_at: new Date().toISOString()
            })
            .eq('id', transactionId);
          
          // Update job status regardless of payment API error
          const { error: jobUpdateError } = await supabase
            .from('jobs')
            .update({ status: 'complete' })
            .eq('id', jobId);
          
          return new Response(JSON.stringify({ 
            success: true, 
            warning: 'Transaction marked as released but fund disbursement failed',
            error: chipError.message 
          }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
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
