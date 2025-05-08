
import { Job } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import JobDetails from "@/components/jobs/JobDetails";

interface JobStatusSectionProps {
  job: Job;
  categoryLabel: string;
}

export default function JobStatusSection({ job, categoryLabel }: JobStatusSectionProps) {
  return (
    <div className="mb-6">
      <JobDetails job={job} categoryLabel={categoryLabel} />
    </div>
  );
}
