
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Job, Bid } from "@/types/job";
import { getFreelancerData, getAuthSession, createChipPayment, releaseChipPayment } from "@/utils/paymentUtils";

export function usePayment(job: Job, bid: Bid, user: any, profile: any) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const initiatePayment = async (milestoneId?: string) => {
    if (!user || !profile) {
      toast.error("You must be logged in to make payments");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get freelancer data
      const { data: freelancerData, error: freelancerError } = await getFreelancerData(bid.user_id);
      
      if (freelancerError) {
        throw new Error(`Failed to retrieve freelancer data: ${freelancerError.message}`);
      }
      
      // Get auth token
      const session = await getAuthSession();
      
      // Determine payment amount - either milestone or full bid
      let paymentAmount = bid.fee;
      let paymentReference = `Job ${job.id.substring(0, 8)}`;
      
      if (milestoneId) {
        const { data: milestoneData, error: milestoneError } = await supabase
          .from("milestones")
          .select("*")
          .eq("id", milestoneId)
          .single();
          
        if (milestoneError) {
          throw new Error(`Failed to retrieve milestone data: ${milestoneError.message}`);
        }
        
        if (milestoneData) {
          paymentAmount = Number(milestoneData.amount);
          paymentReference = `Milestone: ${milestoneData.title} - ${job.id.substring(0, 8)}`;
        }
      }
      
      // Create payment request data
      const paymentData = {
        jobId: job.id,
        bidId: bid.id,
        milestoneId: milestoneId || null,
        amount: paymentAmount,
        currency: job.currency,
        buyerName: `${profile.first_name} ${profile.last_name}`,
        buyerEmail: user.email,
        payeeId: bid.user_id,
        reference: paymentReference
      };
      
      // Call payment API
      const result = await createChipPayment(session, paymentData);
      
      // Redirect to payment page
      window.location.href = result.payment_url;
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown payment error";
      toast.error(errorMessage || "Failed to process payment");
      throw new Error(`Payment initiation failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const releasePayment = async () => {
    if (!user) {
      toast.error("You must be logged in to release payments");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get auth token
      const session = await getAuthSession();
      
      // Call release payment API
      const result = await releaseChipPayment(session, job.id, job.id);
      
      if (result.warning) {
        toast.warning("Payment marked as released, but there was an issue with fund disbursement.");
      } else {
        toast.success("Payment released successfully to freelancer!");
      }
      
    } catch (error) {
      console.error("Payment release error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage || "Failed to release payment");
      throw new Error(`Payment release failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    initiatePayment,
    releasePayment
  };
}
