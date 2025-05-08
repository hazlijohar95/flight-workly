
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { CHIP_SEND_API_URL, generateChecksum } from "../lib/chip.ts";

export async function handleReleasePayment(
  req: Request,
  supabase: SupabaseClient,
  user: any,
  requestData: any,
  corsHeaders: Record<string, string>
): Promise<Response> {
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
        'Authorization': `Bearer ${getChipApiKey()}`,
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
        'Authorization': `Bearer ${getChipApiKey()}`,
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
        'Authorization': `Bearer ${getChipApiKey()}`,
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

function getChipApiKey() {
  return Deno.env.get('CHIP_API_KEY');
}
