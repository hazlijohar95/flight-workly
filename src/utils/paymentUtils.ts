
import { supabase } from "@/integrations/supabase/client";
import { logException } from "@/utils/logger";
import type { Session } from "@supabase/supabase-js";

interface PaymentData {
  amount: number;
  currency: string;
  jobId: string;
  freelancerId: string;
  description?: string;
}

interface ChipPaymentResponse {
  transactionId: string;
  status: string;
  paymentUrl?: string;
  error?: string;
}

interface FreelancerData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  user_type: string | null;
  is_beta_tester: boolean;
  created_at: string;
  updated_at: string;
}

// Get freelancer data by user ID
export async function getFreelancerData(userId: string): Promise<FreelancerData | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    logException(error, 'getFreelancerData');
    return null;
  }

  return data as FreelancerData;
}

// Get Supabase auth session
export async function getAuthSession(): Promise<Session> {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error("No active session found");
  }
  
  return session;
}

// Call CHIP payment API to create a payment
export async function createChipPayment(
  session: Session,
  paymentData: PaymentData
): Promise<ChipPaymentResponse> {
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
  
  return result as ChipPaymentResponse;
}

// Call CHIP payment API to release payment
export async function releaseChipPayment(
  session: Session,
  transactionId: string,
  jobId: string
): Promise<ChipPaymentResponse> {
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
  
  return result as ChipPaymentResponse;
}
