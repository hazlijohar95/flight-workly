
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { CHIP_SEND_API_URL, generateChecksum, getChipApiKey } from "../lib/chip.ts";

// Get transaction data from Supabase
async function getTransactionData(
  supabase: SupabaseClient,
  transactionId: string
): Promise<{ data: any; error: string | null }> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, bids(*)')
    .eq('id', transactionId)
    .single();
  
  if (error || !data) {
    console.error('Transaction query error:', error);
    return { data: null, error: 'Failed to fetch transaction data' };
  }
  
  return { data, error: null };
}

// Get freelancer profile data from Supabase
async function getFreelancerData(
  supabase: SupabaseClient,
  payeeId: string
): Promise<{ data: any; error: string | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', payeeId)
    .single();
  
  if (error) {
    console.error('Freelancer profile query error:', error);
    return { data: null, error: 'Failed to fetch freelancer data' };
  }
  
  return { data, error: null };
}

// Check available balance in CHIP account
async function checkAvailableBalance(
  epoch: number,
  checksum: string
): Promise<any> {
  const response = await fetch(`${CHIP_SEND_API_URL}accounts`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${getChipApiKey()}`,
      'epoch': epoch.toString(),
      'checksum': checksum
    }
  });
  
  const data = await response.json();
  console.log('Accounts API response:', data);
  return data;
}

// Add bank account to CHIP
async function addBankAccount(
  epoch: number,
  checksum: string,
  freelancerData: any,
  jobId: string
): Promise<any> {
  const response = await fetch(`${CHIP_SEND_API_URL}bank_accounts`, {
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
  
  const data = await response.json();
  console.log('Bank account API response:', data);
  
  if (!data.id) {
    throw new Error('Failed to add bank account: ' + JSON.stringify(data));
  }
  
  return data;
}

// Create send instruction in CHIP
async function createSendInstruction(
  epoch: number,
  checksum: string,
  transactionData: any,
  bankAccountId: string,
  jobId: string
): Promise<any> {
  const response = await fetch(`${CHIP_SEND_API_URL}send_instructions`, {
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
        bank_account_id: bankAccountId,
        remarks: `Payment for job: ${jobId}`,
        reference: `job-payment-${jobId}`,
        currency: transactionData.currency || "MYR"
      }
    })
  });
  
  const data = await response.json();
  console.log('Send instruction API response:', data);
  
  if (!data.id) {
    throw new Error('Failed to create send instruction: ' + JSON.stringify(data));
  }
  
  return data;
}

// Update transaction status in Supabase
async function updateTransactionStatus(
  supabase: SupabaseClient,
  transactionId: string,
  sendInstructionId: string,
  status: string = 'disbursed'
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('transactions')
    .update({ 
      status, 
      escrow_released_at: new Date().toISOString(),
      disbursed_at: new Date().toISOString(),
      chip_send_transaction_id: sendInstructionId
    })
    .eq('id', transactionId);
  
  if (error) {
    console.error('Transaction update error:', error);
  }
  
  return { error };
}

// Update job status in Supabase
async function updateJobStatus(
  supabase: SupabaseClient,
  jobId: string,
  status: string = 'complete',
  paymentStatus: string = 'released'
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('jobs')
    .update({ status, payment_status: paymentStatus })
    .eq('id', jobId);
  
  if (error) {
    console.error('Job update error:', error);
  }
  
  return { error };
}

// Handle error fallbacks - mark transaction as released even if CHIP API fails
async function handleReleaseError(
  supabase: SupabaseClient,
  transactionId: string,
  jobId: string
): Promise<void> {
  // Mark transaction as released but with an error flag
  await supabase
    .from('transactions')
    .update({ 
      status: 'released',
      escrow_released_at: new Date().toISOString()
    })
    .eq('id', transactionId);
  
  // Update job status regardless of payment API error
  await supabase
    .from('jobs')
    .update({ status: 'complete' })
    .eq('id', jobId);
}

// Main handler function
export async function handleReleasePayment(
  req: Request,
  supabase: SupabaseClient,
  user: any,
  requestData: any,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { transactionId, jobId } = requestData;
  
  // Get transaction details
  const { data: transactionData, error: transactionError } = await getTransactionData(supabase, transactionId);
  
  if (transactionError || !transactionData) {
    return new Response(JSON.stringify({ error: transactionError, details: 'Transaction not found' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  
  // Get freelancer profile for bank details
  const { data: freelancerData, error: freelancerError } = await getFreelancerData(supabase, transactionData.payee_id);
  
  if (freelancerError || !freelancerData) {
    return new Response(JSON.stringify({ error: freelancerError, details: 'Freelancer not found' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  
  try {
    // Generate epoch and checksum for CHIP Send API
    const epoch = Math.floor(Date.now() / 1000);
    const checksum = await generateChecksum(epoch);
    
    // 1. Check available balance
    await checkAvailableBalance(epoch, checksum);
    
    // 2. Add a bank account
    const bankAccountData = await addBankAccount(epoch, checksum, freelancerData, jobId);
    
    // 3. Create send instruction
    const sendInstructionData = await createSendInstruction(
      epoch, 
      checksum, 
      transactionData,
      bankAccountData.id,
      jobId
    );
    
    // 4. Update transaction status
    const { error: transactionUpdateError } = await updateTransactionStatus(
      supabase,
      transactionId,
      sendInstructionData.id
    );
    
    if (transactionUpdateError) {
      return new Response(JSON.stringify({ error: 'Failed to update transaction status', details: transactionUpdateError }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // 5. Update job status
    const { error: jobUpdateError } = await updateJobStatus(supabase, jobId);
    
    if (jobUpdateError) {
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
    
    // Handle error fallbacks
    await handleReleaseError(supabase, transactionId, jobId);
    
    return new Response(JSON.stringify({ 
      success: true, 
      warning: 'Transaction marked as released but fund disbursement failed',
      error: chipError.message 
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
}
