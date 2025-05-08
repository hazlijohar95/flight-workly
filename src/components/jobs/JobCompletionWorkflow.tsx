
import { useState } from "react";
import { toast } from "sonner";
import { FileCheck, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Job, Bid, WorkSubmission } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface JobCompletionWorkflowProps {
  job: Job;
  bid: Bid | null;
  onStatusUpdate: () => void;
}

export default function JobCompletionWorkflow({ job, bid, onStatusUpdate }: JobCompletionWorkflowProps) {
  const { user } = useAuth();
  const [deliverableNote, setDeliverableNote] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  
  if (!user || !bid) return null;
  
  const isFreelancer = bid.user_id === user.id;
  const isJobOwner = job.user_id === user.id;
  
  // Freelancer can submit work if the job is in progress
  const canSubmitWork = isFreelancer && job.status === "in_progress" && job.payment_status === "paid";
  
  // Job owner can review work if freelancer has submitted it
  const canReviewWork = isJobOwner && job.status === "in_progress" && job.payment_status === "paid";
  
  // If true, freelancer has submitted work but job owner hasn't approved/rejected
  const workSubmitted = job.status === "in_progress" && job.payment_status === "paid";
  
  const handleSubmitWork = async () => {
    if (!deliverableNote.trim()) {
      toast.error("Please provide details about your completed work");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert the work submission record
      const { error: submissionError } = await supabase
        .from("work_submissions")
        .insert({
          job_id: job.id,
          bid_id: bid.id,
          user_id: user.id,
          note: deliverableNote,
          status: "pending_review"
        });
        
      if (submissionError) throw submissionError;
      
      toast.success("Work submitted successfully! Waiting for client review.");
      onStatusUpdate();
    } catch (error) {
      console.error("Error submitting work:", error);
      toast.error("Failed to submit work. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReviewWork = async (approved: boolean) => {
    setIsReviewing(true);
    
    try {
      // Get the latest submission first
      const { data: submissions, error: fetchError } = await supabase
        .from("work_submissions")
        .select("*")
        .eq("job_id", job.id)
        .order("created_at", { ascending: false })
        .limit(1);
        
      if (fetchError) throw fetchError;
      if (!submissions || submissions.length === 0) {
        throw new Error("No work submission found");
      }
      
      const submission = submissions[0];
      
      // Update the job status
      const { error: jobError } = await supabase
        .from("jobs")
        .update({
          status: approved ? "complete" : "in_progress",
        })
        .eq("id", job.id);
        
      if (jobError) throw jobError;
      
      // Update the work submission status
      const { error: submissionError } = await supabase
        .from("work_submissions")
        .update({
          status: approved ? "approved" : "rejected",
          review_note: reviewNote,
        })
        .eq("id", submission.id);
        
      if (submissionError) throw submissionError;
      
      if (approved) {
        toast.success("Work approved! You can now release the payment.");
      } else {
        toast.info("You've requested revisions. The freelancer will be notified.");
      }
      
      onStatusUpdate();
    } catch (error) {
      console.error("Error reviewing work:", error);
      toast.error("Failed to process work review. Please try again.");
    } finally {
      setIsReviewing(false);
    }
  };

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
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Describe the work you've completed and provide any necessary instructions or links to deliverables:
            </p>
            <Textarea 
              value={deliverableNote}
              onChange={(e) => setDeliverableNote(e.target.value)}
              placeholder="Describe your completed work, include links to deliverables if applicable"
              className="min-h-32"
            />
          </div>
        )}
        
        {canReviewWork && workSubmission && (
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-muted/30">
              <h4 className="font-medium mb-1">Freelancer's Submission Note:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{workSubmission.note}</p>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Provide feedback about the work (optional):
            </p>
            <Textarea 
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Optional feedback about the submitted work"
              className="min-h-20"
            />
          </div>
        )}
        
        {!canSubmitWork && !canReviewWork && workSubmission && (
          <div className="border rounded-md p-4 bg-muted/30">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Work Status:</span>
              <span className={`text-sm px-2 py-0.5 rounded ${
                workSubmission.status === "pending_review" 
                  ? "bg-yellow-100 text-yellow-800" 
                  : workSubmission.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {workSubmission.status === "pending_review" 
                  ? "Pending Review" 
                  : workSubmission.status === "approved"
                  ? "Approved"
                  : "Needs Revision"}
              </span>
            </div>
            
            <h4 className="font-medium mb-1">Submission Details:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{workSubmission.note}</p>
            
            {workSubmission.review_note && (
              <>
                <h4 className="font-medium mb-1 mt-3">Client Feedback:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{workSubmission.review_note}</p>
              </>
            )}
          </div>
        )}
      </CardContent>
      
      {(canSubmitWork || canReviewWork) && (
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2">
          {canSubmitWork && (
            <Button
              onClick={handleSubmitWork}
              disabled={isSubmitting || !deliverableNote.trim()}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Submit Work
                </>
              )}
            </Button>
          )}
          
          {canReviewWork && workSubmission && (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                onClick={() => handleReviewWork(true)}
                disabled={isReviewing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isReviewing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve Work
              </Button>
              <Button
                onClick={() => handleReviewWork(false)}
                disabled={isReviewing}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Request Revisions
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
