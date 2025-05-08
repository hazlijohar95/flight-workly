
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job, Bid, Transaction, Milestone } from "@/types/job";
import MilestonePaymentList from "./MilestonePaymentList";

interface MilestoneBasedPaymentProps {
  job: Job;
  bid: Bid;
  isJobOwner: boolean;
  isFreelancer: boolean;
  onInitiatePayment: (milestoneId: string) => Promise<void>;
  onPaymentComplete?: () => void;
}

export default function MilestoneBasedPayment({
  job,
  bid,
  isJobOwner,
  isFreelancer,
  onInitiatePayment,
  onPaymentComplete
}: MilestoneBasedPaymentProps) {
  // Fetch milestones
  const { data: milestones } = useQuery({
    queryKey: ["milestones", job.id],
    queryFn: async () => {
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

  if (!milestones || milestones.length === 0) {
    return null;
  }

  return (
    <MilestonePaymentList
      job={job}
      bid={bid}
      milestones={milestones}
      isJobOwner={isJobOwner}
      isFreelancer={isFreelancer}
      onInitiatePayment={onInitiatePayment}
      onPaymentComplete={onPaymentComplete}
    />
  );
}
