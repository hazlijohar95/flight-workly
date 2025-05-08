
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Job, Bid, WorkSubmission } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import WorkSubmissionForm from "./completion/WorkSubmissionForm";
import WorkReviewForm from "./completion/WorkReviewForm";
import WorkStatusDisplay from "./completion/WorkStatusDisplay";

interface JobCompletionWorkflowProps {
  job: Job;
  bid: Bid | null;
  onStatusUpdate: () => void;
}

export default function JobCompletionWorkflow({ job, bid, onStatusUpdate }: JobCompletionWorkflowProps) {
  const { user } = useAuth();
  
  if (!user || !bid) return null;
  
  const isFreelancer = bid.user_id === user.id;
  const isJobOwner = job.user_id === user.id;
  
  // Freelancer can submit work if the job is in progress
  const canSubmitWork = isFreelancer && job.status === "in_progress" && job.payment_status === "paid";
  
  // Job owner can review work if freelancer has submitted it
  const canReviewWork = isJobOwner && job.status === "in_progress" && job.payment_status === "paid";
  
  // If true, freelancer has submitted work but job owner hasn't approved/rejected
  const workSubmitted = job.status === "in_progress" && job.payment_status === "paid";
  
  // Get the latest work submission
  const { data: workSubmission } = useQuery({
    queryKey: ["workSubmission", job.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_submissions")
        .select("*")
        .eq("job_id", job.id)
        .order("created_at", { ascending: false })
        .limit(1);
        
      if (error) throw error;
      return data[0] as WorkSubmission | undefined;
    },
  });

  if (!canSubmitWork && !canReviewWork && !workSubmitted) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="bg-blue-50 border-b">
        <div className="flex items-center">
          <FileCheck className="h-5 w-5 text-blue-500 mr-2" />
          <CardTitle className="text-lg">Work Completion</CardTitle>
        </div>
        <CardDescription>
          {canSubmitWork 
            ? "Submit your completed work for client review" 
            : canReviewWork 
              ? "Review the submitted work from the freelancer"
              : "Work submission status"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        {canSubmitWork && (
          <WorkSubmissionForm 
            job={job} 
            bid={bid} 
            userId={user.id}
            onStatusUpdate={onStatusUpdate}
          />
        )}
        
        {canReviewWork && workSubmission && (
          <WorkReviewForm 
            job={job}
            workSubmission={workSubmission}
            onStatusUpdate={onStatusUpdate}
          />
        )}
        
        {!canSubmitWork && !canReviewWork && workSubmission && (
          <WorkStatusDisplay workSubmission={workSubmission} />
        )}
      </CardContent>
      
      {/* CardFooter is now handled within each component */}
    </Card>
  );
}
