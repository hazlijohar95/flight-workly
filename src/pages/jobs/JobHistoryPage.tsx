
import DashboardLayout from "@/components/DashboardLayout";
import JobHistory from "@/components/jobs/JobHistory";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function JobHistoryPage(): JSX.Element {
  const { profile } = useRequireAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job History</h1>
          <p className="text-muted-foreground">
            {profile?.user_type === "job_poster" 
              ? "View your completed job posts and outcomes"
              : "View your completed jobs and client feedback"}
          </p>
        </div>

        <JobHistory limit={20} showViewAll={false} />
      </div>
    </DashboardLayout>
  );
}
