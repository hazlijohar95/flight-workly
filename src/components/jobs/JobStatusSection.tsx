
import { Job } from "@/types/job";
import JobDetails from "@/components/jobs/JobDetails";

interface JobStatusSectionProps {
  job: Job;
  categoryLabel: string;
}

export default function JobStatusSection({ job, categoryLabel }: JobStatusSectionProps): JSX.Element {
  return (
    <div className="mb-6">
      <JobDetails job={job} categoryLabel={categoryLabel} />
    </div>
  );
}
