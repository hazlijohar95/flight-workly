
import MilestoneForm from "./MilestoneForm";

interface MilestoneFormValues {
  title: string;
  description?: string;
  amount: string;
  due_date?: Date;
}

interface MilestoneFormContainerProps {
  showAddForm: boolean;
  jobId: string;
  jobBudget: number;
  isSubmitting: boolean;
  onSubmit: (values: MilestoneFormValues) => Promise<void>;
}

export default function MilestoneFormContainer({
  showAddForm,
  jobId,
  jobBudget,
  isSubmitting,
  onSubmit
}: MilestoneFormContainerProps): JSX.Element | null {
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
