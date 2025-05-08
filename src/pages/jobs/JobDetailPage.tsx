
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, DollarSign, Calendar } from "lucide-react";
import { format, formatDistance } from "date-fns";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BidForm from "@/components/jobs/BidForm";
import BidList from "@/components/jobs/BidList";
import PaymentSection from "@/components/jobs/PaymentSection"; // Import the payment section
import { Job, Bid, Transaction } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import useRequireAuth from "@/hooks/useRequireAuth";
import { JOB_CATEGORIES } from "@/constants/jobCategories";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, profile } = useRequireAuth({ requireBetaAccess: true });
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
  
  // Format dates
  const createdDate = format(new Date(job.created_at), "PPP");
  const deadlineDate = format(new Date(job.deadline), "PPP");
  const biddingEndsAt = new Date(job.bidding_end_time);
  const biddingTimeLeft = formatDistance(biddingEndsAt, new Date(), { addSuffix: true });
  
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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center">
          <Link to="/dashboard/jobs">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline">{categoryLabel}</Badge>
                <Badge
                  variant="outline"
                  className={
                    job.status === "open" ? "bg-green-100 text-green-800" :
                    job.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                    job.status === "complete" ? "bg-gray-100 text-gray-800" :
                    "bg-blue-100 text-blue-800"
                  }
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                
                {job.payment_status === 'paid' && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Payment in Escrow
                  </Badge>
                )}
              </div>
            </div>
            
            {canBid && (
              <Button onClick={() => setShowBidForm(true)} disabled={showBidForm}>
                Submit Bid
              </Button>
            )}
            
            {hasBid && (
              <Badge className="bg-blue-100 text-blue-800">
                You've already bid on this job
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Job Details</h2>
                </CardHeader>
                <CardContent>
                  {job.description ? (
                    <div className="prose max-w-none">
                      <p>{job.description}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No description provided</p>
                  )}
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <div className="flex items-center font-medium">
                        <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                        {job.currency} {job.budget.toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <div className="flex items-center font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                        {createdDate}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <div className="flex items-center font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                        {deadlineDate}
                      </div>
                    </div>
                    
                    {job.status === 'open' && (
                      <div className="col-span-2 sm:col-span-3">
                        <p className="text-sm text-muted-foreground">Bidding Status</p>
                        <div className="flex items-center font-medium">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          {biddingEnded ? (
                            <span className="text-red-500">Bidding closed</span>
                          ) : (
                            <span>Bidding ends {biddingTimeLeft}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
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
                <Card className="mt-6">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Submit Your Bid</h2>
                  </CardHeader>
                  <CardContent>
                    <BidForm job={job} onBidSubmitted={handleBidSubmit} />
                  </CardContent>
                </Card>
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
