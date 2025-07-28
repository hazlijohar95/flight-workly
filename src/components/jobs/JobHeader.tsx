
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";

interface JobHeaderProps {
  job: Job;
  isOwner: boolean;
  isFreelancer: boolean;
  canBid: boolean;
  hasBid: boolean;
  showBidForm: boolean;
  onShowBidForm: () => void;
}

export default function JobHeader({ 
  job, 
  isOwner: _isOwner, 
  isFreelancer: _isFreelancer, 
  canBid, 
  hasBid,
  showBidForm,
  onShowBidForm
}: JobHeaderProps): JSX.Element {
  const categoryLabel = job.category;

  return (
    <>
      <div className="flex items-center">
        <Link to="/dashboard/jobs">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs
          </Button>
        </Link>
      </div>
      
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
          <Button onClick={onShowBidForm} disabled={showBidForm}>
            Submit Bid
          </Button>
        )}
        
        {hasBid && (
          <Badge className="bg-blue-100 text-blue-800">
            You've already bid on this job
          </Badge>
        )}
      </div>
    </>
  );
}
