
import { Job, Transaction } from "@/types/job";

interface MilestoneProgressBarProps {
  totalPaid: number;
  totalBudget: number;
  job: Job;
}

export default function MilestoneProgressBar({
  totalPaid,
  totalBudget,
  job
}: MilestoneProgressBarProps) {
  return (
    <div className="bg-muted/20 p-3 rounded-md mb-4 text-sm">
      <div className="flex justify-between">
        <span>Total paid so far:</span>
        <span className="font-medium">{job.currency} {totalPaid.toFixed(2)} of {totalBudget.toFixed(2)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${Math.min(100, (totalPaid / totalBudget) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
