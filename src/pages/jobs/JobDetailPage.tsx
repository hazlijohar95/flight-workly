
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import JobDetailLoader from "@/components/jobs/detail/JobDetailLoader";
import JobDetailLayout from "@/components/jobs/detail/JobDetailLayout";
import { useJobDetail } from "@/hooks/useJobDetail";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, profile } = useRequireAuth();
  
  const {
    job,
    isLoadingJob,
    jobError,
    bids,
    isLoadingBids,
    bidsError,
    transaction,
    isOwner,
    categoryLabel,
    acceptedBid,
    showBidForm,
    setShowBidForm,
    hasBid,
    canBid,
    handleBidSubmit,
    handleBidAccepted,
    handlePaymentComplete,
    handleWorkflowUpdate,
    handleJobUpdate
  } = useJobDetail(jobId, user?.id, profile?.user_type === "freelancer");
  
  if (!user || !profile) {
    return <div>Loading...</div>;
  }
  
  if (isLoadingJob || jobError || !job) {
    return (
      <JobDetailLoader 
        isLoading={isLoadingJob} 
        error={jobError} 
      />
    );
  }
  
  // Debug information
  console.log("JobDetailPage - Job:", job);
  console.log("JobDetailPage - Bids:", bids);
  console.log("JobDetailPage - Job status:", job.status);
  console.log("JobDetailPage - Accepted bid:", acceptedBid);
  console.log("JobDetailPage - Is owner:", isOwner);
  
  const onBidSubmit = () => {
    handleBidSubmit();
    toast.success("Your bid has been submitted!");
  };
  
  const onBidAccepted = () => {
    handleBidAccepted();
    toast.success("Bid accepted successfully! You can now make a payment.");
  };

  return (
    <DashboardLayout>
      <JobDetailLayout
        job={job}
        bids={bids}
        isLoadingBids={isLoadingBids}
        bidsError={bidsError}
        acceptedBid={acceptedBid}
        transaction={transaction}
        categoryLabel={categoryLabel}
        isOwner={isOwner}
        isFreelancer={profile.user_type === "freelancer"}
        canBid={canBid}
        hasBid={hasBid}
        showBidForm={showBidForm}
        onShowBidForm={() => setShowBidForm(true)}
        onBidSubmit={onBidSubmit}
        onBidAccepted={onBidAccepted}
        onWorkflowUpdate={handleWorkflowUpdate}
        onPaymentComplete={handlePaymentComplete}
        onJobUpdate={handleJobUpdate}
      />
    </DashboardLayout>
  );
}
