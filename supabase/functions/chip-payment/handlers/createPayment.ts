
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { CHIP_API_URL } from "../lib/chip.ts";

export async function handleCreatePayment(
  req: Request,
  supabase: SupabaseClient,
  user: any,
  requestData: any,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { 
    jobId, 
    bidId, 
    milestoneId, // Added support for milestone payments
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
      'Authorization': `Bearer ${getChipApiKey()}`,
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
        success_redirect: `${new URL(req.url).origin}/dashboard/jobs/${jobId}/payment-success`,
        failure_redirect: `${new URL(req.url).origin}/dashboard/jobs/${jobId}/payment-failed`,
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
      milestone_id: milestoneId || null, // Store milestone ID if provided
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
  
  // If this is a milestone payment, update the milestone status
  if (milestoneId) {
    const { error: milestoneUpdateError } = await supabase
      .from('milestones')
      .update({ status: 'in_progress' })
      .eq('id', milestoneId);
      
    if (milestoneUpdateError) {
      console.error('Milestone update error:', milestoneUpdateError);
    }
  }
  
  return new Response(JSON.stringify({ 
    success: true, 
    payment_url: chipData.checkout_url,
    transaction_id: chipData.id 
  }), 
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function getChipApiKey() {
  return Deno.env.get('CHIP_API_KEY');
}
