
import { format, formatDistance } from "date-fns";
import { DollarSign, Calendar, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Job } from "@/types/job";

interface JobDetailsProps {
  job: Job;
  categoryLabel: string;
}

export default function JobDetails({ job, categoryLabel }: JobDetailsProps) {
  // Format dates
  const createdDate = format(new Date(job.created_at), "PPP");
  const deadlineDate = format(new Date(job.deadline), "PPP");
  const biddingEndsAt = new Date(job.bidding_end_time);
  const biddingTimeLeft = formatDistance(biddingEndsAt, new Date(), { addSuffix: true });
  const biddingEnded = new Date() > biddingEndsAt;

  return (
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
  );
}
