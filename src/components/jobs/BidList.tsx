
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, Clock, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bid } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface BidListProps {
  bids: Bid[];
  jobId: string;
  onBidAccepted?: () => void;
}

export default function BidList({ bids, jobId, onBidAccepted }: BidListProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingBidId, setLoadingBidId] = useState<string | null>(null);
  
  if (bids.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No bids yet</p>;
  }
  
  const handleAcceptBid = async (bidId: string) => {
    if (!user) {
      toast.error("You must be logged in to accept bids");
      return;
    }
    
    setLoadingBidId(bidId);
    
    try {
      // Update the bid status to accepted
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId)
        .eq('job_id', jobId);
        
      if (bidError) throw bidError;
      
      // Update the job status to in_progress
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'in_progress' })
        .eq('id', jobId);
        
      if (jobError) throw jobError;
      
      // Reject all other bids
      const { error: otherBidsError } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .neq('id', bidId);
        
      if (otherBidsError) throw otherBidsError;
      
      toast.success("Bid accepted successfully!");
      
      if (onBidAccepted) {
        onBidAccepted();
      }
    } catch (error: any) {
      console.error("Error accepting bid:", error);
      toast.error(error.message || "Failed to accept bid");
    } finally {
      setLoadingBidId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Bids ({bids.length})</h3>
      
      {bids.map((bid) => (
        <Card key={bid.id} className="overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <h4 className="font-semibold">Freelancer Bid</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(bid.created_at).toLocaleDateString()}
              </p>
            </div>
            
            {bid.status === 'accepted' && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <Check className="h-3 w-3 mr-1" /> Accepted
              </div>
            )}
            
            {bid.status === 'rejected' && (
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Rejected
              </div>
            )}
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Fee</p>
                <p className="font-medium">${bid.fee.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Time Estimate</p>
                <p className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  {bid.time_estimate} hour{bid.time_estimate !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {bid.note && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Note</p>
                <p className="text-sm">{bid.note}</p>
              </div>
            )}
            
            {bid.portfolio_url && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Portfolio</p>
                <a 
                  href={bid.portfolio_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline flex items-center"
                >
                  {bid.portfolio_url.replace(/^https?:\/\//, '')}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
            
            {bid.status === 'pending' && (
              <Button 
                onClick={() => handleAcceptBid(bid.id)} 
                className="w-full mt-2"
                disabled={!!loadingBidId}
              >
                {loadingBidId === bid.id ? "Accepting..." : "Accept Bid"}
              </Button>
            )}
            
            {bid.status === 'accepted' && (
              <Button 
                onClick={() => navigate(`/dashboard/jobs/${jobId}/chat`)}
                variant="outline" 
                className="w-full mt-2"
              >
                Open Chat
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
