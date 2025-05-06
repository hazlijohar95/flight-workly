
import DashboardLayout from "@/components/DashboardLayout";
import PostJobForm from "@/components/jobs/PostJobForm";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function NewJobPage() {
  const { profile } = useRequireAuth({ requireBetaAccess: true });

  if (!profile || profile.user_type !== "job_poster") {
    return (
      <DashboardLayout>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
          <h3 className="font-medium text-amber-800 mb-1">Access Denied</h3>
          <p className="text-sm text-amber-700">
            Only business accounts can post jobs. Please update your profile if you wish to post jobs.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-muted-foreground">
            Describe what you need and set your budget
          </p>
        </div>

        <PostJobForm />
      </div>
    </DashboardLayout>
  );
}
