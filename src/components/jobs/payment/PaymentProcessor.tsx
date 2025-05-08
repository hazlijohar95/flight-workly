
import { Job, Bid } from "@/types/job";
import { usePayment } from "@/hooks/usePayment";

interface PaymentProcessorProps {
  job: Job;
  bid: Bid;
  user: any;
  profile: any;
  children: (handlers: {
    handleInitiatePayment: (milestoneId?: string) => Promise<void>;
    handleReleasePayment: () => Promise<void>;
    isProcessing: boolean;
  }) => React.ReactNode;
}

export default function PaymentProcessor({
  job,
  bid,
  user,
  profile,
  children
}: PaymentProcessorProps) {
  // Debug information
  console.log("PaymentProcessor - Job:", job);
  console.log("PaymentProcessor - Bid:", bid);
  console.log("PaymentProcessor - User:", user?.id);
  
  const { initiatePayment, releasePayment, isProcessing } = usePayment(job, bid, user, profile);

  return children({
    handleInitiatePayment: initiatePayment,
    handleReleasePayment: releasePayment,
    isProcessing
  });
}
