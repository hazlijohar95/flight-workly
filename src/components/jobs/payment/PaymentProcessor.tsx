
import { Job, Bid } from "@/types/job";
import { usePayment } from "@/hooks/usePayment";
import { AuthUser, UserProfile } from "@/types/index";
import { logDebug } from "@/utils/logger";

interface PaymentProcessorProps {
  job: Job;
  bid: Bid;
  user: AuthUser | null;
  profile: UserProfile | null;
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
  profile: _profile,
  children
}: PaymentProcessorProps): React.ReactElement {
  // Debug information
  logDebug("PaymentProcessor - Job", "PaymentProcessor", { job });
  logDebug("PaymentProcessor - Bid", "PaymentProcessor", { bid });
  logDebug("PaymentProcessor - User", "PaymentProcessor", { userId: user?.id });
  
  const { createPayment: _createPayment, releasePayment: _releasePayment, isLoading } = usePayment();

  const handleInitiatePayment = async (milestoneId?: string): Promise<void> => {
    // Implementation would go here
    logDebug("Initiating payment", "PaymentProcessor", { jobId: job.id, milestoneId });
  };

  const handleReleasePayment = async (): Promise<void> => {
    // Implementation would go here
    logDebug("Releasing payment", "PaymentProcessor", { jobId: job.id });
  };

  return children({
    handleInitiatePayment,
    handleReleasePayment,
    isProcessing: isLoading
  }) as React.ReactElement;
}
