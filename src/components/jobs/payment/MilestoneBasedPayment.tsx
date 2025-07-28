
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job, Bid, Milestone } from "@/types/job";
import MilestonePaymentList from "./MilestonePaymentList";
import PaymentErrorBoundary from "./PaymentErrorBoundary";

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
}: MilestoneBasedPaymentProps): JSX.Element | null {
  // Fetch milestones
  const { data: milestones, isLoading, refetch } = useQuery({
    queryKey: ["milestones", job.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("job_id", job.id)
        .order("order_index", { ascending: true });
      
      if (error) {
        throw error;
      }
      return data as Milestone[];
    },
    enabled: !!job.uses_milestones,
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 h-40 rounded-md"></div>;
  }

  if (!milestones || milestones.length === 0) {
    return null;
  }

  return (
    <PaymentErrorBoundary onReset={() => refetch()}>
      <MilestonePaymentList
        job={job}
        bid={bid}
        milestones={milestones}
        isJobOwner={isJobOwner}
        isFreelancer={isFreelancer}
        onInitiatePayment={onInitiatePayment}
        onPaymentComplete={onPaymentComplete}
      />
    </PaymentErrorBoundary>
  );
}
