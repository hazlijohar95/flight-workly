
import MilestoneForm from "./MilestoneForm";
import { Job } from "@/types/job";

interface MilestoneFormContainerProps {
  showAddForm: boolean;
  jobId: string;
  jobBudget: number;
  isSubmitting: boolean;
  onSubmit: (values: any) => Promise<void>;
}

export default function MilestoneFormContainer({
  showAddForm,
  jobId,
  jobBudget,
  isSubmitting,
  onSubmit
}: MilestoneFormContainerProps) {
  if (!showAddForm) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-muted/20">
      <MilestoneForm 
        jobId={jobId} 
        jobBudget={jobBudget}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
