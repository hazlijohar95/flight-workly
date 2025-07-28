
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { generateChecksum } from "../lib/chip.ts";
import { 
  checkAvailableBalance, 
  addBankAccount, 
  createSendInstruction 
} from "../utils/chipApiUtils.ts";
import {
  getTransactionData,
  getFreelancerData,
  updateTransactionStatus,
  updateJobStatus,
  handleReleaseError
} from "../utils/dbUtils.ts";

// Main handler function
export async function handleReleasePayment(
  req: Request,
  supabase: SupabaseClient,
  user: Record<string, unknown>,
  requestData: Record<string, unknown>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { transactionId, jobId } = requestData as {
    transactionId: string;
    jobId: string;
  };
  
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
    
    // Execute the CHIP API payment flow
    const paymentResult = await executeChipPaymentFlow(epoch, checksum, freelancerData, transactionData, jobId);
    
    // Update transaction and job status
    const { error: transactionUpdateError } = await updateTransactionStatus(
      supabase,
      transactionId,
      paymentResult.sendInstructionId
    );
    
    if (transactionUpdateError) {
      return new Response(JSON.stringify({ error: 'Failed to update transaction status', details: transactionUpdateError }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Update job status
    const { error: jobUpdateError } = await updateJobStatus(supabase, jobId);
    
    if (jobUpdateError) {
      return new Response(JSON.stringify({ error: 'Failed to update job status', details: jobUpdateError }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      send_instruction_id: paymentResult.sendInstructionId,
      status: paymentResult.status
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

// Helper function to execute the CHIP payment flow
async function executeChipPaymentFlow(
  epoch: number,
  checksum: string,
  freelancerData: Record<string, unknown>,
  transactionData: Record<string, unknown>,
  jobId: string
): Promise<{ sendInstructionId: string, status: string }> {
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
  
  return {
    sendInstructionId: sendInstructionData.id,
    status: sendInstructionData.status
  };
}
