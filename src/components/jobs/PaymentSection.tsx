
import { useAuth } from "@/context/AuthContext";
import { Job, Bid, Transaction } from "@/types/job";
import PaymentProcessor from "./payment/PaymentProcessor";
import MilestoneBasedPayment from "./payment/MilestoneBasedPayment";
import StandardPaymentHandler from "./payment/StandardPaymentHandler";

interface PaymentSectionProps {
  job: Job;
  bid: Bid | null;
  transaction?: Transaction;
  onPaymentComplete?: () => void;
}

export default function PaymentSection({ job, bid, transaction, onPaymentComplete }: PaymentSectionProps) {
  const { user, profile } = useAuth();
  
  // We need the accepted bid for payment
  if (!bid) {
    return null;
  }
  
  const isJobOwner = user?.id === job.user_id;
  const isFreelancer = bid && user?.id === bid.user_id;
  
  return (
    <PaymentProcessor job={job} bid={bid} user={user} profile={profile}>
      {({ handleInitiatePayment, handleReleasePayment }) => (
        <>
          {/* Milestone-based payment flow */}
          {job.uses_milestones && (
            <MilestoneBasedPayment
              job={job}
              bid={bid}
              isJobOwner={!!isJobOwner}
              isFreelancer={!!isFreelancer}
              onInitiatePayment={handleInitiatePayment}
              onPaymentComplete={onPaymentComplete}
            />
          )}
          
          {/* Standard payment flow (non-milestone payments) */}
          {!job.uses_milestones && (
            <StandardPaymentHandler
              job={job}
              bid={bid}
              transaction={transaction}
              isJobOwner={!!isJobOwner}
              isFreelancer={!!isFreelancer}
              onInitiatePayment={() => handleInitiatePayment()}
              onReleasePayment={handleReleasePayment}
            />
          )}
        </>
      )}
    </PaymentProcessor>
  );
}
