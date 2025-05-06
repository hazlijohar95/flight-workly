
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JobsListPage() {
  const { user, profile } = useRequireAuth({ requireBetaAccess: true });
  const [activeTab, setActiveTab] = useState<string>("available");

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ["jobs", activeTab, user?.id],
    queryFn: async () => {
      try {
        let query = supabase
          .from("jobs")
          .select("*");

        if (activeTab === "available") {
          // For freelancers: show all open jobs
          if (profile?.user_type === "freelancer") {
            query = query.eq("status", "open");
          } 
          // For job posters: show their own jobs
          else if (profile?.user_type === "job_poster") {
            query = query.eq("user_id", user?.id);
          }
        } else if (activeTab === "applied" && profile?.user_type === "freelancer") {
          // For freelancers: show jobs they've bid on
          const { data: bids, error: bidsError } = await supabase
            .from("bids")
            .select("job_id")
            .eq("user_id", user?.id);

          if (bidsError) throw bidsError;
          
          const jobIds = bids.map(bid => bid.job_id);
          
          if (jobIds.length === 0) return [];
          
          query = query.in("id", jobIds);
        }
        
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as Job[];
      } catch (error: any) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
        return [];
      }
    },
    enabled: !!user && !!profile?.user_type,
  });

  useEffect(() => {
    if (profile?.user_type === "job_poster") {
      setActiveTab("available");
    }
  }, [profile?.user_type]);

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  const isFreelancer = profile.user_type === "freelancer";
  const isJobPoster = profile.user_type === "job_poster";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isJobPoster ? "My Job Posts" : "Available Jobs"}
            </h1>
            <p className="text-muted-foreground">
              {isJobPoster
                ? "Manage your job postings and review bids"
                : "Find opportunities and submit your proposals"}
            </p>
          </div>

          {isJobPoster && (
            <Link to="/dashboard/jobs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Post a New Job
              </Button>
            </Link>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="available">
              {isJobPoster ? "My Jobs" : "Available Jobs"}
            </TabsTrigger>
            {isFreelancer && <TabsTrigger value="applied">My Applications</TabsTrigger>}
          </TabsList>

          <TabsContent value="available" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                Error loading jobs. Please try again.
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isOwner={job.user_id === user.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                {isJobPoster ? (
                  <div>
                    <p className="mb-4">You haven't posted any jobs yet.</p>
                    <Link to="/dashboard/jobs/new">
                      <Button>Post Your First Job</Button>
                    </Link>
                  </div>
                ) : (
                  <p>No jobs available at the moment. Check back soon!</p>
                )}
              </div>
            )}
          </TabsContent>

          {isFreelancer && (
            <TabsContent value="applied" className="mt-4">
              {isLoading ? (
                <div className="text-center py-8">Loading applications...</div>
              ) : jobs && jobs.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>You haven't applied to any jobs yet.</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
