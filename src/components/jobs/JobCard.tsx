
import { formatDistance } from "date-fns";
import { Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { Job } from "@/types/job";
import { Link } from "react-router-dom";

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  isOwner?: boolean; 
}

export function JobCard({ job, showActions = true, isOwner = false }: JobCardProps) {
  const categoryLabel = JOB_CATEGORIES.find(c => c.value === job.category)?.label || job.category;
  
  // Calculate time left until bidding ends
  const biddingEndsAt = new Date(job.bidding_end_time);
  const timeLeft = formatDistance(biddingEndsAt, new Date(), { addSuffix: true });
  
  // Format currency
  const formattedBudget = `${job.currency} ${job.budget.toFixed(2)}`;
  
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'bidding':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'complete':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{job.title}</CardTitle>
          <Badge variant="outline" className={`${getStatusColor(job.status)} text-white`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <span className="font-medium mr-2">{categoryLabel}</span>
          <span className="text-xs">•</span>
          <span className="ml-2">{new Date(job.created_at).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {job.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {job.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="font-medium">{formattedBudget}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-sm">Bidding ends {timeLeft}</span>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="bg-muted/50 pt-3">
          <div className="w-full flex justify-between items-center">
            {isOwner ? (
              <Link to={`/dashboard/jobs/${job.id}`} className="w-full">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            ) : (
              <Link to={`/dashboard/jobs/${job.id}`} className="w-full">
                <Button variant="default" className="w-full">Submit Bid</Button>
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
