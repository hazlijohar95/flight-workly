
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job, Bid, Transaction } from "@/types/job";
import { JOB_CATEGORIES } from "@/constants/jobCategories";

export function useJobDetail(jobId: string | undefined, userId: string | undefined, isFreelancer: boolean) {
  const [showBidForm, setShowBidForm] = useState(false);
  const [hasBid, setHasBid] = useState(false);
  
  // Fetch job data
  const { 
    data: job, 
    isLoading: isLoadingJob, 
    error: jobError, 
    refetch: refetchJob 
  } = useQuery({
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
  
  // Fetch bids data
  const { 
    data: bids, 
    isLoading: isLoadingBids, 
    error: bidsError, 
    refetch: refetchBids 
  } = useQuery({
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
      if (!jobId || !userId) return null;
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false })
        .limit(1);
        
      if (error) throw error;
      return data[0] as Transaction | null;
    },
    enabled: !!jobId && !!userId && !!job && (job.status === 'in_progress' || job.status === 'complete'),
  });
  
  // Check if the current user has already bid on this job
  useEffect(() => {
    if (userId && bids) {
      const userBid = bids.find(bid => bid.user_id === userId);
      setHasBid(!!userBid);
    }
  }, [userId, bids]);

  // Calculate derived state
  const isOwner = job ? job.user_id === userId : false;
  const categoryLabel = job ? 
    JOB_CATEGORIES.find(c => c.value === job.category)?.label || job.category : '';
  
  // Find the accepted bid if there is one
  const acceptedBid = bids?.find(bid => bid.status === 'accepted') || null;
  
  // Calculate bidding status
  const biddingEndsAt = job ? new Date(job.bidding_end_time) : new Date();
  const biddingEnded = new Date() > biddingEndsAt;
  const canBid = isFreelancer && !isOwner && !hasBid && job?.status === "open" && !biddingEnded;

  const handleBidSubmit = () => {
    setShowBidForm(false);
    setHasBid(true);
    refetchBids();
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

  const handleJobUpdate = () => {
    refetchJob();
  };
  
  return {
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
    biddingEnded,
    handleBidSubmit,
    handleBidAccepted,
    handlePaymentComplete,
    handleWorkflowUpdate,
    handleJobUpdate
  };
}
