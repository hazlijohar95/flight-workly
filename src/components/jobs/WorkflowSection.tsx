
import { Job, Bid } from "@/types/job";
import JobCompletionWorkflow from "@/components/jobs/JobCompletionWorkflow";

interface WorkflowSectionProps {
  job: Job;
  bid: Bid | null;
  onStatusUpdate: () => void;
}

export default function WorkflowSection({ job, bid, onStatusUpdate }: WorkflowSectionProps): JSX.Element | null {
  if (job.status !== "in_progress" && job.status !== "complete") {
    return null;
  }

  return (
    <div className="mt-6">
      <JobCompletionWorkflow 
        job={job} 
        bid={bid} 
        onStatusUpdate={onStatusUpdate}
      />
    </div>
  );
}
