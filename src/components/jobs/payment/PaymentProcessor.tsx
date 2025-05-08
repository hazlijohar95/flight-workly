
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Job, Bid, Transaction } from "@/types/job";

interface PaymentProcessorProps {
  job: Job;
  bid: Bid;
  user: any;
  profile: any;
  children: (handlers: {
    handleInitiatePayment: (milestoneId?: string) => Promise<void>;
    handleReleasePayment: () => Promise<void>;
  }) => React.ReactNode;
}

export default function PaymentProcessor({
  job,
  bid,
  user,
  profile,
  children
}: PaymentProcessorProps) {
  const navigate = useNavigate();
  
  const handleInitiatePayment = async (milestoneId?: string) => {
    if (!user || !profile) {
      toast.error("You must be logged in to make payments");
      return;
    }
    
    try {
      const { data: freelancerData, error: freelancerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", bid.user_id)
        .single();
      
      if (freelancerError) {
        throw freelancerError;
      }
      
      // Get auth token for the edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found");
      }
      
      // Determine payment amount - either use milestone amount or full bid amount
      let paymentAmount = bid.fee;
      let paymentReference = `Job ${job.id.substring(0, 8)}`;
      
      if (milestoneId) {
        const { data: milestoneData, error: milestoneError } = await supabase
          .from("milestones")
          .select("*")
          .eq("id", milestoneId)
          .single();
          
        if (milestoneError) {
          throw milestoneError;
        }
        
        if (milestoneData) {
          paymentAmount = Number(milestoneData.amount);
          paymentReference = `Milestone: ${milestoneData.title} - ${job.id.substring(0, 8)}`;
        }
      }
      
      // Call our edge function to create payment
      const response = await fetch(`https://tjdnpprinmfopgcrqtbe.supabase.co/functions/v1/chip-payment/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          jobId: job.id,
          bidId: bid.id,
          milestoneId: milestoneId || null,
          amount: paymentAmount,
          currency: job.currency,
          buyerName: `${profile.first_name} ${profile.last_name}`,
          buyerEmail: user.email,
          payeeId: bid.user_id,
          reference: paymentReference
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Payment initiation failed');
      }
      
      // Redirect to Chip payment page
      window.location.href = result.payment_url;
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    }
  };
  
  const handleReleasePayment = async () => {
    if (!user) {
      return;
    }
    
    try {
      // Get auth token for the edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found");
      }
      
      // Call our edge function to release payment
      const response = await fetch(`https://tjdnpprinmfopgcrqtbe.supabase.co/functions/v1/chip-payment/release-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          transactionId: job.id,
          jobId: job.id
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Payment release failed');
      }
      
      if (result.warning) {
        toast.warning("Payment marked as released, but there was an issue with fund disbursement.");
      } else {
        toast.success("Payment released successfully to freelancer!");
      }
      
    } catch (error) {
      console.error("Payment release error:", error);
      toast.error(error.message || "Failed to release payment");
    }
  };

  return children({
    handleInitiatePayment,
    handleReleasePayment
  });
}
