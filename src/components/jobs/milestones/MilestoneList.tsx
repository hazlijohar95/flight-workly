
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, Check, Clock, Edit, Trash } from "lucide-react";
import { format } from "date-fns";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Milestone, Job } from "@/types/job";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MilestoneListProps {
  milestones: Milestone[];
  job: Job;
  isJobOwner: boolean;
  onMilestoneAction?: () => void;
}

export default function MilestoneList({
  milestones,
  job,
  isJobOwner,
  onMilestoneAction,
}: MilestoneListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  if (!milestones.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No milestones have been created for this job.
      </div>
    );
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    setIsDeleting(milestoneId);
    
    try {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", milestoneId);

      if (error) throw error;
      
      toast.success("Milestone deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["milestones", job.id] });
      if (onMilestoneAction) onMilestoneAction();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error("Failed to delete milestone");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMarkComplete = async (milestoneId: string) => {
    setIsMarkingComplete(milestoneId);
    
    try {
      const { error } = await supabase
        .from("milestones")
        .update({ status: "completed" })
        .eq("id", milestoneId);

      if (error) throw error;
      
      toast.success("Milestone marked as complete");
      queryClient.invalidateQueries({ queryKey: ["milestones", job.id] });
      if (onMilestoneAction) onMilestoneAction();
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone");
    } finally {
      setIsMarkingComplete(null);
    }
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <Card key={milestone.id} className="relative">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg">{milestone.title}</CardTitle>
              <Badge
                variant={
                  milestone.status === "completed"
                    ? "success"
                    : milestone.status === "in_progress"
                    ? "default"
                    : "outline"
                }
                className="capitalize"
              >
                {milestone.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            {milestone.description && (
              <p className="text-muted-foreground mb-3">{milestone.description}</p>
            )}
            
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium">Payment Amount:</span>
              <span className="font-semibold">
                {job.currency} {Number(milestone.amount).toFixed(2)}
              </span>
            </div>
            
            {milestone.due_date && (
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Due: {format(new Date(milestone.due_date), "MMM d, yyyy")}</span>
              </div>
            )}
          </CardContent>
          
          {isJobOwner && (
            <CardFooter className="border-t pt-3 flex gap-2 flex-wrap">
              {milestone.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkComplete(milestone.id)}
                  disabled={isMarkingComplete === milestone.id}
                >
                  {isMarkingComplete === milestone.id ? (
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Mark Complete
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this milestone? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteMilestone(milestone.id);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting === milestone.id ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
