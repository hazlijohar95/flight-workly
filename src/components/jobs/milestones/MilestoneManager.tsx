
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Job, Milestone } from "@/types/job";
import MilestoneForm from "./MilestoneForm";
import MilestoneList from "./MilestoneList";

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

  const totalMilestoneAmount = milestones?.reduce(
    (sum, milestone) => sum + Number(milestone.amount),
    0
  ) || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Milestones</h3>
        {isJobOwner && job.status === "open" && (
          <Button 
            size="sm" 
            variant={showAddForm ? "outline" : "default"}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            {showAddForm ? "Cancel" : "Add Milestone"}
          </Button>
        )}
      </div>
      
      {showAddForm && (
        <div className="border rounded-lg p-4 bg-muted/20">
          <MilestoneForm 
            jobId={job.id} 
            jobBudget={job.budget}
            onSubmit={handleAddMilestone}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
      
      {milestones && milestones.length > 0 && (
        <div className="bg-muted/20 p-3 rounded-md text-sm flex justify-between">
          <span>Total milestone amount:</span>
          <span className="font-semibold">
            {job.currency} {totalMilestoneAmount.toFixed(2)} 
            {totalMilestoneAmount !== job.budget && ` (${((totalMilestoneAmount / job.budget) * 100).toFixed()}% of budget)`}
          </span>
        </div>
      )}
      
      {milestones && (
        <MilestoneList 
          milestones={milestones} 
          job={job} 
          isJobOwner={isJobOwner}
          onMilestoneAction={handleMilestoneAction}
        />
      )}
    </div>
  );
}
