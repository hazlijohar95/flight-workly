
import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Job, WorkSubmission } from "@/types/job";
import { logException } from "@/utils/logger";

interface WorkReviewFormProps {
  job: Job;
  workSubmission: WorkSubmission;
  onStatusUpdate: () => void;
}

export default function WorkReviewForm({ job, workSubmission, onStatusUpdate }: WorkReviewFormProps): JSX.Element {
  const [reviewNote, setReviewNote] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReviewWork = async (approved: boolean): Promise<void> => {
    setIsReviewing(true);
    
    try {
      // Update the job status
      const { error: jobError } = await supabase
        .from("jobs")
        .update({
          status: approved ? "complete" : "in_progress",
        })
        .eq("id", job.id);
        
      if (jobError) {
        throw jobError;
      }
      
      // Update the work submission status
      const { error: submissionError } = await supabase
        .from("work_submissions")
        .update({
          status: approved ? "approved" : "rejected",
          review_note: reviewNote,
        })
        .eq("id", workSubmission.id);
        
      if (submissionError) {
        throw submissionError;
      }
      
      if (approved) {
        toast.success("Work approved! You can now release the payment.");
      } else {
        toast.info("You've requested revisions. The freelancer will be notified.");
      }
      
      onStatusUpdate();
    } catch (error) {
      logException(error, "WorkReviewForm.handleReviewWork");
      toast.error("Failed to process work review. Please try again.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
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
    </div>
  );
}
