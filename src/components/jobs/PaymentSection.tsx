
import { useAuth } from "@/context/AuthContext";
import { Job, Bid, Transaction } from "@/types/job";
import PaymentProcessor from "./payment/PaymentProcessor";
import MilestoneBasedPayment from "./payment/MilestoneBasedPayment";
import StandardPaymentHandler from "./payment/StandardPaymentHandler";
import PaymentErrorBoundary from "./payment/PaymentErrorBoundary";
import { logException } from "@/utils/logger";

interface PaymentSectionProps {
  job: Job;
  bid: Bid | null;
  transaction?: Transaction;
  onPaymentComplete?: () => void;
  onPaymentError?: () => void;
}

export default function PaymentSection({ 
  job, 
  bid, 
  transaction, 
  onPaymentComplete,
  onPaymentError
}: PaymentSectionProps): JSX.Element | null {
  const { user, profile } = useAuth();
  
  // We need the accepted bid for payment
  if (!bid) {
    return null;
  }
  
  const isJobOwner = user?.id === job.user_id;
  const isFreelancer = bid && user?.id === bid.user_id;
  
  return (
    <PaymentErrorBoundary>
      <PaymentProcessor job={job} bid={bid} user={user} profile={profile}>
        {({ handleInitiatePayment, handleReleasePayment, isProcessing }) => {
          // Create wrapped payment handlers that include error handling
          const initiatePayment = async (milestoneId?: string): Promise<void> => {
            try {
              await handleInitiatePayment(milestoneId);
              if (onPaymentComplete) {
                onPaymentComplete();
              }
            } catch (error) {
              logException(error, "PaymentSection.initiatePayment");
              if (onPaymentError) {
                onPaymentError();
              }
            }
          };
          
          const releasePayment = async (): Promise<void> => {
            try {
              await handleReleasePayment();
              if (onPaymentComplete) {
                onPaymentComplete();
              }
            } catch (error) {
              logException(error, "PaymentSection.releasePayment");
              if (onPaymentError) {
                onPaymentError();
              }
            }
          };
          
          return (
            <>
              {/* Milestone-based payment flow */}
              {job.uses_milestones && (
                <MilestoneBasedPayment
                  job={job}
                  bid={bid}
                  isJobOwner={!!isJobOwner}
                  isFreelancer={!!isFreelancer}
                  onInitiatePayment={initiatePayment}
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
                  isProcessing={isProcessing}
                  onInitiatePayment={initiatePayment}
                  onReleasePayment={releasePayment}
                />
              )}
            </>
          );
        }}
      </PaymentProcessor>
    </PaymentErrorBoundary>
  );
}
