
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
  onInitiatePayment: () => Promise<void>;
  onReleasePayment: () => Promise<void>;
}

export default function StandardPaymentHandler({
  job,
  bid,
  transaction,
  isJobOwner,
  isFreelancer,
  onInitiatePayment,
  onReleasePayment
}: StandardPaymentHandlerProps) {
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
        onReleasePayment={onReleasePayment}
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
        onInitiatePayment={onInitiatePayment}
      />
    );
  }
  
  return null;
}
