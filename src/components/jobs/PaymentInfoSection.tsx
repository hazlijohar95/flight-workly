
import { Job, Bid, Transaction } from "@/types/job";
import PaymentSection from "@/components/jobs/PaymentSection";

interface PaymentInfoSectionProps {
  job: Job;
  bid: Bid | null;
  transaction: Transaction | undefined;
  isOwner: boolean;
  isFreelancer: boolean;
  onPaymentComplete: () => void;
}

export default function PaymentInfoSection({ 
  job, 
  bid, 
  transaction, 
  isOwner, 
  isFreelancer, 
  onPaymentComplete 
}: PaymentInfoSectionProps) {
  if (!(isOwner || (isFreelancer && bid?.user_id === bid?.user_id)) || 
      job.status === 'open') {
    return null;
  }

  return (
    <div className="mt-6">
      <PaymentSection 
        job={job} 
        bid={bid} 
        transaction={transaction || undefined} 
        onPaymentComplete={onPaymentComplete}
      />
    </div>
  );
}
