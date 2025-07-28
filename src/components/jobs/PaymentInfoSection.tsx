
import { useState } from "react";
import { Job, Bid, Transaction } from "@/types/job";
import PaymentSection from "@/components/jobs/PaymentSection";
import PaymentErrorBoundary from "./payment/PaymentErrorBoundary";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logDebug } from "@/utils/logger";

interface PaymentInfoSectionProps {
  job: Job | null;
  bid: Bid | null;
  transaction: Transaction | undefined;
  isOwner: boolean;
  isFreelancer: boolean;
  onPaymentComplete?: () => void;
}

export default function PaymentInfoSection({ 
  job, 
  bid, 
  transaction, 
  isOwner, 
  isFreelancer, 
  onPaymentComplete 
}: PaymentInfoSectionProps): JSX.Element | null {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle component errors outside the error boundary
  if (!job) {
    return null;
  }
  
  // For debugging
  logDebug("PaymentInfoSection - Job status", "PaymentInfoSection", { status: job.status });
  logDebug("PaymentInfoSection - Payment status", "PaymentInfoSection", { paymentStatus: job.payment_status });
  logDebug("PaymentInfoSection - Is owner", "PaymentInfoSection", { isOwner });
  logDebug("PaymentInfoSection - Bid", "PaymentInfoSection", { bid });
  
  // Check access permissions early - show for job owners when job is in_progress
  const hasAccess = isOwner || (isFreelancer && bid?.user_id === bid?.user_id);
  
  // Only show payment section for in_progress jobs
  if (!hasAccess || job.status !== 'in_progress') {
    logDebug("PaymentInfoSection - No access or job not in progress", "PaymentInfoSection", { hasAccess, status: job.status });
    return null;
  }
  
  const handlePaymentError = (): void => {
    setIsProcessing(false);
    toast.error("There was a problem processing your payment request");
  };
  
  const handlePaymentComplete = (): void => {
    setIsProcessing(false);
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  // Loading state
  if (isProcessing) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[100px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-sm text-muted-foreground">Processing payment request...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-6">
      <PaymentErrorBoundary onReset={() => setIsProcessing(false)}>
        <PaymentSection 
          job={job} 
          bid={bid} 
          transaction={transaction} 
          onPaymentComplete={handlePaymentComplete}
          onPaymentError={handlePaymentError}
        />
      </PaymentErrorBoundary>
    </div>
  );
}
