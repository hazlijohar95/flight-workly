
import { useState } from "react";
import { Job, Bid } from "@/types/job";
import BidFormContainer from "@/components/jobs/BidFormContainer";
import BidList from "@/components/jobs/BidList";

interface BidSectionProps {
  job: Job;
  bids: Bid[] | undefined;
  isLoadingBids: boolean;
  bidsError: unknown;
  isOwner: boolean;
  showBidForm: boolean;
  onBidSubmitted: () => void;
  onBidAccepted: () => void;
}

export default function BidSection({
  job,
  bids,
  isLoadingBids,
  bidsError,
  isOwner,
  showBidForm,
  onBidSubmitted,
  onBidAccepted
}: BidSectionProps) {
  return (
    <>
      {/* Bid Form */}
      {showBidForm && (
        <BidFormContainer job={job} onBidSubmitted={onBidSubmitted} />
      )}
      
      {/* Bids Section - Only visible to job owner */}
      {isOwner && (
        isLoadingBids ? (
          <div className="text-center py-8">Loading bids...</div>
        ) : bidsError ? (
          <div className="text-center text-red-500">Error loading bids</div>
        ) : (
          <BidList 
            bids={bids || []} 
            jobId={job.id} 
            onBidAccepted={onBidAccepted} 
          />
        )
      )}
    </>
  );
}
