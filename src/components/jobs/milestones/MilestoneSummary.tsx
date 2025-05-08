
import { Milestone, Job } from "@/types/job";

interface MilestoneSummaryProps {
  milestones: Milestone[] | null;
  job: Job;
}

export default function MilestoneSummary({ milestones, job }: MilestoneSummaryProps) {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  const totalMilestoneAmount = milestones?.reduce(
    (sum, milestone) => sum + Number(milestone.amount),
    0
  ) || 0;

  return (
    <div className="bg-muted/20 p-3 rounded-md text-sm flex justify-between">
      <span>Total milestone amount:</span>
      <span className="font-semibold">
        {job.currency} {totalMilestoneAmount.toFixed(2)} 
        {totalMilestoneAmount !== job.budget && ` (${((totalMilestoneAmount / job.budget) * 100).toFixed()}% of budget)`}
      </span>
    </div>
  );
}
