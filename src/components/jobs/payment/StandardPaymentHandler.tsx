
import { Job, Bid, Transaction } from "@/types/job";
import CompletedPaymentCard from "./CompletedPaymentCard";
import EscrowPaymentCard from "./EscrowPaymentCard";
import ProcessingPaymentCard from "./ProcessingPaymentCard";
import UnpaidPaymentCard from "./UnpaidPaymentCard";

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
}: StandardPaymentHandlerProps) {
  // Debug information
  console.log("StandardPaymentHandler - Job:", job);
  console.log("StandardPaymentHandler - Bid:", bid);
  console.log("StandardPaymentHandler - Transaction:", transaction);
  console.log("StandardPaymentHandler - isJobOwner:", isJobOwner);
  console.log("StandardPaymentHandler - Job status:", job.status);
  console.log("StandardPaymentHandler - Payment status:", job.payment_status);
  console.log("StandardPaymentHandler - Bid status:", bid.status);
  
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
    console.log("StandardPaymentHandler - Showing payment button");
    return (
      <UnpaidPaymentCard
        bid={bid}
        currency={job.currency}
        isProcessing={isProcessing}
        onInitiatePayment={onInitiatePayment}
      />
    );
  }
  
  console.log("StandardPaymentHandler - No payment card shown");
  return null;
}
