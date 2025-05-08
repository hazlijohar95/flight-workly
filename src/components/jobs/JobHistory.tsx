
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { History, FileCheck, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";

interface JobHistoryProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function JobHistory({ limit = 5, showViewAll = true }: JobHistoryProps) {
  const { user, profile } = useAuth();
  
  const { data: completedJobs, isLoading } = useQuery({
    queryKey: ["completedJobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from("jobs")
        .select("*, bids(*)")
        .eq("status", "complete");
        
      // Filter jobs based on user type
      if (profile?.user_type === "job_poster") {
        // Get jobs created by this user
        query = query.eq("user_id", user.id);
      } else if (profile?.user_type === "freelancer") {
        // Get jobs where this user's bid was accepted
        const { data: acceptedBids } = await supabase
          .from("bids")
          .select("job_id")
          .eq("user_id", user.id)
          .eq("status", "accepted");
          
        if (!acceptedBids?.length) return [];
        
        const jobIds = acceptedBids.map(bid => bid.job_id);
        query = query.in("id", jobIds);
      }
      
      const { data, error } = await query
        .order("updated_at", { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data as Job[];
    },
    enabled: !!user && !!profile,
  });
  
  if (!user || isLoading) {
    return (
      <Card className="h-40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Job History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-24">
          <p className="text-muted-foreground text-sm">Loading history...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!completedJobs || completedJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Job History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No completed jobs yet. Your job history will appear here once you've completed jobs.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" /> Job History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedJobs.map(job => {
            const categoryInfo = JOB_CATEGORIES.find(c => c.value === job.category);
            const categoryLabel = categoryInfo?.label || job.category;
            const acceptedBid = job.bids?.find(bid => bid.status === 'accepted');
            
            return (
              <Link 
                key={job.id} 
                to={`/dashboard/jobs/${job.id}`}
                className="block"
              >
                <div className="border rounded-md p-3 hover:bg-muted/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="flex gap-2 items-center mt-1">
                        <Badge variant="outline">{categoryLabel}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Completed {formatDistance(new Date(job.updated_at), new Date(), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      <DollarSign className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  {acceptedBid && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Final payment:</span>{" "}
                      <span className="font-medium">{job.currency} {acceptedBid.fee.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        
        {showViewAll && completedJobs.length >= limit && (
          <div className="mt-4 text-center">
            <Link 
              to="/dashboard/jobs/history"
              className="text-sm text-primary hover:underline"
            >
              View all completed jobs
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
