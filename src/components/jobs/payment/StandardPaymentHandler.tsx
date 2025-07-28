
import { Job, Bid, Transaction } from "@/types/job";
import CompletedPaymentCard from "./CompletedPaymentCard";
import EscrowPaymentCard from "./EscrowPaymentCard";
import ProcessingPaymentCard from "./ProcessingPaymentCard";
import UnpaidPaymentCard from "./UnpaidPaymentCard";
import { logDebug } from "@/utils/logger";

interface StandardPaymentHandlerProps {
  job: Job;
  bid: Bid;
  transaction?: Transaction;
  isJobOwner: boolean;
  isFreelancer: boolean;
  isProcessing: boolean;
  onInitiatePayment: () => Promise<void>;
  onReleasePayment: () => Promise<void>;
}

export default function StandardPaymentHandler({
  job,
  bid,
  transaction,
  isJobOwner,
  isFreelancer,
  isProcessing,
  onInitiatePayment,
  onReleasePayment
}: StandardPaymentHandlerProps): JSX.Element | null {
  // Debug information
  logDebug("StandardPaymentHandler - Job", undefined, { job });
  logDebug("StandardPaymentHandler - Bid", undefined, { bid });
  logDebug("StandardPaymentHandler - Transaction", undefined, { transaction });
  logDebug("StandardPaymentHandler - isJobOwner", undefined, { isJobOwner });
  logDebug("StandardPaymentHandler - Job status", undefined, { status: job.status });
  logDebug("StandardPaymentHandler - Payment status", undefined, { payment_status: job.payment_status });
  logDebug("StandardPaymentHandler - Bid status", undefined, { bid_status: bid.status });
  
  // Funds have been disbursed to the freelancer
  if (transaction?.status === 'disbursed') {
    return (
      <CompletedPaymentCard
        bid={bid}
        transaction={transaction}
        currency={job.currency}
        isFreelancer={isFreelancer}
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
        isJobOwner={isJobOwner}
        isFreelancer={isFreelancer}
        isProcessing={isProcessing}
        onReleasePayment={onReleasePayment}
      />
    );
  }
  
  // Payment is being processed
  if (job.payment_status === 'processing') {
    return <ProcessingPaymentCard />;
  }
  
  // Default state - payment required - always show for job owner when job is in_progress
  if (isJobOwner && job.status === 'in_progress' && bid.status === 'accepted' && 
      (!job.payment_status || job.payment_status === 'unpaid')) {
    logDebug("StandardPaymentHandler - Showing payment button");
    return (
      <UnpaidPaymentCard
        bid={bid}
        currency={job.currency}
        isProcessing={isProcessing}
        onInitiatePayment={onInitiatePayment}
      />
    );
  }
  
  logDebug("StandardPaymentHandler - No payment card shown");
  return null;
}
