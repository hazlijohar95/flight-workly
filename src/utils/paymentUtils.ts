
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Get freelancer data by user ID
export async function getFreelancerData(userId: string) {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
}

// Get Supabase auth session
export async function getAuthSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error("No active session found");
  }
  
  return session;
}

// Call CHIP payment API to create a payment
export async function createChipPayment(
  session: any,
  paymentData: any
) {
  const response = await fetch(
    `https://tjdnpprinmfopgcrqtbe.supabase.co/functions/v1/chip-payment/create-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(paymentData)
    }
  );
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Payment initiation failed');
  }
  
  return result;
}

// Call CHIP payment API to release payment
export async function releaseChipPayment(
  session: any,
  transactionId: string,
  jobId: string
) {
  const response = await fetch(
    `https://tjdnpprinmfopgcrqtbe.supabase.co/functions/v1/chip-payment/release-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        transactionId,
        jobId
      })
    }
  );
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Payment release failed');
  }
  
  return result;
}
