
import { WorkSubmission } from "@/types/job";

interface WorkStatusDisplayProps {
  workSubmission: WorkSubmission;
}

export default function WorkStatusDisplay({ workSubmission }: WorkStatusDisplayProps): JSX.Element {
  return (
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
  );
}
