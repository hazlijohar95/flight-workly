
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Job, Milestone } from "@/types/job";
import MilestoneList from "./MilestoneList";
import MilestoneHeader from "./MilestoneHeader";
import MilestoneSummary from "./MilestoneSummary";
import MilestoneFormContainer from "./MilestoneFormContainer";

interface MilestoneManagerProps {
  job: Job;
  isJobOwner: boolean;
  onUpdateJob: () => void;
}

export default function MilestoneManager({ 
  job, 
  isJobOwner,
  onUpdateJob
}: MilestoneManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch milestones for this job
  const { data: milestones, isLoading } = useQuery({
    queryKey: ["milestones", job.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("job_id", job.id)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as Milestone[];
    },
  });

  const handleAddMilestone = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // If this is the first milestone, enable milestones for the job
      if (!job.uses_milestones) {
        const { error: jobError } = await supabase
          .from("jobs")
          .update({ uses_milestones: true })
          .eq("id", job.id);
        
        if (jobError) throw jobError;
      }
      
      const { error } = await supabase
        .from("milestones")
        .insert({
          job_id: job.id,
          title: values.title,
          description: values.description || "",
          amount: Number(values.amount),
          due_date: values.due_date,
          order_index: milestones ? milestones.length : 0,
        });
      
      if (error) throw error;
      
      toast.success("Milestone added successfully");
      queryClient.invalidateQueries({ queryKey: ["milestones", job.id] });
      setShowAddForm(false);
      onUpdateJob();
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast.error("Failed to add milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMilestoneAction = () => {
    queryClient.invalidateQueries({ queryKey: ["milestones", job.id] });
    onUpdateJob();
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading milestones...</div>;
  }

  return (
    <div className="space-y-4">
      <MilestoneHeader 
        showAddForm={showAddForm}
        isJobOwner={isJobOwner}
        jobStatus={job.status}
        onToggleForm={() => setShowAddForm(!showAddForm)}
      />
      
      <MilestoneFormContainer 
        showAddForm={showAddForm}
        jobId={job.id}
        jobBudget={job.budget}
        isSubmitting={isSubmitting}
        onSubmit={handleAddMilestone}
      />
      
      <MilestoneSummary milestones={milestones} job={job} />
      
      {milestones && milestones.length > 0 ? (
        <MilestoneList 
          milestones={milestones} 
          job={job} 
          isJobOwner={isJobOwner}
          onMilestoneAction={handleMilestoneAction}
        />
      ) : !showAddForm && (
        <div className="text-center py-8 text-muted-foreground">
          No milestones have been created for this job.
        </div>
      )}
    </div>
  );
}
