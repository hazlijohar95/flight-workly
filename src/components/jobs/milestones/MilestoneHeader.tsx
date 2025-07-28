
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MilestoneHeaderProps {
  showAddForm: boolean;
  isJobOwner: boolean;
  jobStatus: string;
  onToggleForm: () => void;
}

export default function MilestoneHeader({
  showAddForm,
  isJobOwner,
  jobStatus,
  onToggleForm
}: MilestoneHeaderProps): JSX.Element {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Payment Milestones</h3>
      {isJobOwner && jobStatus === "open" && (
        <Button 
          size="sm" 
          variant={showAddForm ? "outline" : "default"}
          onClick={onToggleForm}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          {showAddForm ? "Cancel" : "Add Milestone"}
        </Button>
      )}
    </div>
  );
}
