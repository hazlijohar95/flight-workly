
import { Job, Bid, Transaction } from "@/types/job";
import JobHeader from "@/components/jobs/JobHeader";
import JobStatusSection from "@/components/jobs/JobStatusSection";
import BidSection from "@/components/jobs/BidSection";
import WorkflowSection from "@/components/jobs/WorkflowSection";
import PaymentInfoSection from "@/components/jobs/PaymentInfoSection";
import MilestoneSection from "@/components/jobs/MilestoneSection";

interface JobDetailLayoutProps {
  job: Job;
  bids: Bid[] | undefined;
  isLoadingBids: boolean;
  bidsError: unknown;
  acceptedBid: Bid | null;
  transaction: Transaction | undefined;
  categoryLabel: string;
  isOwner: boolean;
  isFreelancer: boolean;
  canBid: boolean;
  hasBid: boolean;
  showBidForm: boolean;
  onShowBidForm: () => void;
  onBidSubmit: () => void;
  onBidAccepted: () => void;
  onWorkflowUpdate: () => void;
  onPaymentComplete: () => void;
  onJobUpdate: () => void;
}

export default function JobDetailLayout({
  job,
  bids,
  isLoadingBids,
  bidsError,
  acceptedBid,
  transaction,
  categoryLabel,
  isOwner,
  isFreelancer,
  canBid,
  hasBid,
  showBidForm,
  onShowBidForm,
  onBidSubmit,
  onBidAccepted,
  onWorkflowUpdate,
  onPaymentComplete,
  onJobUpdate
}: JobDetailLayoutProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <JobHeader
          job={job}
          isOwner={isOwner}
          isFreelancer={isFreelancer}
          canBid={canBid}
          hasBid={hasBid}
          showBidForm={showBidForm}
          onShowBidForm={onShowBidForm}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <JobStatusSection job={job} categoryLabel={categoryLabel} />
            
            <WorkflowSection 
              job={job} 
              bid={acceptedBid} 
              onStatusUpdate={onWorkflowUpdate} 
            />
            
            {(isOwner || (acceptedBid && isFreelancer && job.uses_milestones)) && (
              <MilestoneSection
                job={job}
                isOwner={isOwner}
                onUpdateJob={onJobUpdate}
              />
            )}
            
            <PaymentInfoSection 
              job={job} 
              bid={acceptedBid} 
              transaction={transaction} 
              isOwner={isOwner}
              isFreelancer={isFreelancer}
              onPaymentComplete={onPaymentComplete}
            />
            
            {isFreelancer && showBidForm && (
              <div className="mt-6">
                <BidSection
                  job={job}
                  bids={[]}
                  isLoadingBids={false}
                  bidsError={null}
                  isOwner={false}
                  showBidForm={showBidForm}
                  onBidSubmitted={onBidSubmit}
                  onBidAccepted={onBidAccepted}
                />
              </div>
            )}
          </div>
          
          <div className="md:col-span-1">
            {isOwner && (
              <BidSection
                job={job}
                bids={bids}
                isLoadingBids={isLoadingBids}
                bidsError={bidsError}
                isOwner={true}
                showBidForm={false}
                onBidSubmitted={onBidSubmit}
                onBidAccepted={onBidAccepted}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
