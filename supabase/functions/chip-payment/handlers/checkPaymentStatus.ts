
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { CHIP_API_URL } from "../lib/chip.ts";

export async function handleCheckPaymentStatus(
  req: Request,
  supabase: SupabaseClient,
  user: any,
  requestData: any,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { chipTransactionId } = requestData;
  
  const chipResponse = await fetch(`${CHIP_API_URL}/purchases/${chipTransactionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getChipApiKey()}`,
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

function getChipApiKey() {
  return Deno.env.get('CHIP_API_KEY');
}
