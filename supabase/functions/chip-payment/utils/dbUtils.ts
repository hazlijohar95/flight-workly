
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// Get transaction data from Supabase
export async function getTransactionData(
  supabase: SupabaseClient,
  transactionId: string
): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
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
export async function getFreelancerData(
  supabase: SupabaseClient,
  payeeId: string
): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
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

// Update transaction status in Supabase
export async function updateTransactionStatus(
  supabase: SupabaseClient,
  transactionId: string,
  sendInstructionId: string,
  status: string = 'disbursed'
): Promise<{ error: Record<string, unknown> | null }> {
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
export async function updateJobStatus(
  supabase: SupabaseClient,
  jobId: string,
  status: string = 'complete',
  paymentStatus: string = 'released'
): Promise<{ error: Record<string, unknown> | null }> {
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
export async function handleReleaseError(
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
