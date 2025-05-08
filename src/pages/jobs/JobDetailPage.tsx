import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import JobHeader from "@/components/jobs/JobHeader";
import JobDetails from "@/components/jobs/JobDetails";
import BidFormContainer from "@/components/jobs/BidFormContainer";
import BidList from "@/components/jobs/BidList";
import PaymentSection from "@/components/jobs/PaymentSection";
import JobCompletionWorkflow from "@/components/jobs/JobCompletionWorkflow";
import { Job, Bid, Transaction } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import useRequireAuth from "@/hooks/useRequireAuth";
import { JOB_CATEGORIES } from "@/constants/jobCategories";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, profile } = useRequireAuth();
  const [showBidForm, setShowBidForm] = useState(false);
  const [hasBid, setHasBid] = useState(false);
  
  const { data: job, isLoading: isLoadingJob, error: jobError, refetch: refetchJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      if (!jobId) return null;
      
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
        
      if (error) throw error;
      return data as Job;
    },
  });
  
  const { data: bids, isLoading: isLoadingBids, error: bidsError, refetch: refetchBids } = useQuery({
    queryKey: ["bids", jobId],
    queryFn: async () => {
      if (!jobId) return [];
      
      const { data, error } = await supabase
        .from("bids")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data as Bid[];
    },
  });
  
  // Fetch transaction data if the job is in progress or complete
  const { data: transaction } = useQuery({
    queryKey: ["transaction", jobId],
    queryFn: async () => {
      if (!jobId || !user) return null;
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false })
        .limit(1);
        
      if (error) throw error;
      return data[0] as Transaction | null;
    },
    enabled: !!jobId && !!user && !!job && (job.status === 'in_progress' || job.status === 'complete'),
  });
  
  // Check if the current user has already bid on this job
  useEffect(() => {
    if (user && bids) {
      const userBid = bids.find(bid => bid.user_id === user.id);
      setHasBid(!!userBid);
    }
  }, [user, bids]);
  
  if (!user || !profile) {
    return <div>Loading...</div>;
  }
  
  if (isLoadingJob) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading job details...</div>
      </DashboardLayout>
    );
  }
  
  if (jobError || !job) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500 py-8">
          Error loading job details. Please try again.
        </div>
      </DashboardLayout>
    );
  }
  
  const isOwner = job.user_id === user.id;
  const isFreelancer = profile.user_type === "freelancer";
  const categoryLabel = JOB_CATEGORIES.find(c => c.value === job.category)?.label || job.category;
  
  // Find the accepted bid if there is one
  const acceptedBid = bids?.find(bid => bid.status === 'accepted') || null;
  
  const biddingEndsAt = new Date(job.bidding_end_time);
  const biddingEnded = new Date() > biddingEndsAt;
  const canBid = isFreelancer && !isOwner && !hasBid && job.status === "open" && !biddingEnded;
  
  const handleBidSubmit = () => {
    setShowBidForm(false);
    setHasBid(true);
    refetchBids();
    
    // Show success toast
    toast.success("Your bid has been submitted!");
  };
  
  const handleBidAccepted = async () => {
    // Refetch job and bids data
    refetchJob();
    refetchBids();
  };
  
  const handlePaymentComplete = async () => {
    // Refetch job and transaction data
    refetchJob();
  };

  const handleWorkflowUpdate = () => {
    refetchJob();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <JobHeader
            job={job}
            isOwner={isOwner}
            isFreelancer={isFreelancer}
            canBid={canBid}
            hasBid={hasBid}
            showBidForm={showBidForm}
            onShowBidForm={() => setShowBidForm(true)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <JobDetails job={job} categoryLabel={categoryLabel} />
              
              {/* Job Completion Workflow - Display when job is in progress or beyond */}
              {job.status === "in_progress" || job.status === "complete" ? (
                <div className="mt-6">
                  <JobCompletionWorkflow 
                    job={job} 
                    bid={acceptedBid} 
                    onStatusUpdate={handleWorkflowUpdate}
                  />
                </div>
              ) : null}
              
              {/* Payment Section - Display for job owners and accepted freelancers */}
              {(isOwner || (isFreelancer && acceptedBid?.user_id === user.id)) && 
              job.status !== 'open' && (
                <div className="mt-6">
                  <PaymentSection 
                    job={job} 
                    bid={acceptedBid} 
                    transaction={transaction || undefined} 
                    onPaymentComplete={handlePaymentComplete}
                  />
                </div>
              )}
              
              {/* Bid Form */}
              {showBidForm && (
                <BidFormContainer job={job} onBidSubmitted={handleBidSubmit} />
              )}
            </div>
            
            {/* Bids Section - Only visible to job owner */}
            <div className="md:col-span-1">
              {isOwner && (
                isLoadingBids ? (
                  <div className="text-center py-8">Loading bids...</div>
                ) : bidsError ? (
                  <div className="text-center text-red-500">Error loading bids</div>
                ) : (
                  <BidList 
                    bids={bids || []} 
                    jobId={job.id} 
                    onBidAccepted={handleBidAccepted} 
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
