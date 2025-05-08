
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { Job, Bid, Transaction, Milestone } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import CompletedPaymentCard from "./payment/CompletedPaymentCard";
import EscrowPaymentCard from "./payment/EscrowPaymentCard";
import ProcessingPaymentCard from "./payment/ProcessingPaymentCard";
import UnpaidPaymentCard from "./payment/UnpaidPaymentCard";
import MilestonePaymentList from "./payment/MilestonePaymentList";

interface PaymentSectionProps {
  job: Job;
  bid: Bid | null;
  transaction?: Transaction;
  onPaymentComplete?: () => void;
}

export default function PaymentSection({ job, bid, transaction, onPaymentComplete }: PaymentSectionProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  // We need the accepted bid for payment
  if (!bid) {
    return null;
  }
  
  const isJobOwner = user?.id === job.user_id;
  const isFreelancer = bid && user?.id === bid.user_id;

  // Fetch milestones if the job uses them
  const { data: milestones } = useQuery({
    queryKey: ["milestones", job.id],
    queryFn: async () => {
      if (!job.uses_milestones) return null;
      
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("job_id", job.id)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as Milestone[];
    },
    enabled: !!job.uses_milestones,
  });
  
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
      
      if (milestoneId && milestones) {
        const milestone = milestones.find(m => m.id === milestoneId);
        if (milestone) {
          paymentAmount = Number(milestone.amount);
          paymentReference = `Milestone: ${milestone.title} - ${job.id.substring(0, 8)}`;
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
    if (!user || !transaction) {
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
          transactionId: transaction.id,
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
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
      
    } catch (error) {
      console.error("Payment release error:", error);
      toast.error(error.message || "Failed to release payment");
    }
  };
  
  // If the job uses milestones, show milestone payment components
  if (job.uses_milestones && milestones && milestones.length > 0) {
    return (
      <MilestonePaymentList
        job={job}
        bid={bid}
        milestones={milestones}
        isJobOwner={!!isJobOwner}
        isFreelancer={!!isFreelancer}
        onInitiatePayment={handleInitiatePayment}
        onPaymentComplete={onPaymentComplete}
      />
    );
  }
  
  // Standard payment flow (non-milestone payments)
  // Funds have been disbursed to the freelancer
  if (transaction?.status === 'disbursed') {
    return (
      <CompletedPaymentCard
        bid={bid}
        transaction={transaction}
        currency={job.currency}
        isFreelancer={!!isFreelancer}
      />
    );
  }
  
  // Payment is in escrow (waiting to be released)
  if (job.payment_status === 'paid' && transaction?.status === 'completed') {
    return (
      <EscrowPaymentCard
        job={job}
        bid={bid}
        transaction={transaction}
        isJobOwner={!!isJobOwner}
        isFreelancer={!!isFreelancer}
        onReleasePayment={handleReleasePayment}
      />
    );
  }
  
  // Payment is being processed
  if (job.payment_status === 'processing') {
    return <ProcessingPaymentCard />;
  }
  
  // Default state - payment required
  if (isJobOwner && job.status === 'in_progress' && (!job.payment_status || job.payment_status === 'unpaid')) {
    return (
      <UnpaidPaymentCard
        bid={bid}
        currency={job.currency}
        onInitiatePayment={() => handleInitiatePayment()}
      />
    );
  }
  
  return null;
}
