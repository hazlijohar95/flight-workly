
import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Job, Bid } from "@/types/job";

interface WorkSubmissionFormProps {
  job: Job;
  bid: Bid;
  userId: string;
  onStatusUpdate: () => void;
}

export default function WorkSubmissionForm({ job, bid, userId, onStatusUpdate }: WorkSubmissionFormProps) {
  const [deliverableNote, setDeliverableNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          user_id: userId,
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

  return (
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
    </div>
  );
}
