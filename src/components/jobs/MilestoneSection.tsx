
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/types/job";
import MilestoneManager from "@/components/jobs/milestones/MilestoneManager";
import { CircleDollarSign } from "lucide-react";

interface MilestoneSectionProps {
  job: Job;
  isOwner: boolean;
  onUpdateJob: () => void;
}

export default function MilestoneSection({ job, isOwner, onUpdateJob }: MilestoneSectionProps) {
  // Don't show anything in the bidding phase
  if (job.status === "open" && !isOwner) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="bg-blue-50 border-b">
        <div className="flex items-center">
          <CircleDollarSign className="h-5 w-5 text-blue-500 mr-2" />
          <CardTitle className="text-lg">Payment Milestones</CardTitle>
        </div>
        <CardDescription>
          {isOwner
            ? "Break down the job into manageable milestones with separate payments"
            : "Project payment milestones"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <MilestoneManager job={job} isJobOwner={isOwner} onUpdateJob={onUpdateJob} />
      </CardContent>
    </Card>
  );
}
