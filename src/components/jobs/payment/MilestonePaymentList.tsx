
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Job, Bid, Milestone, Transaction } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import MilestoneCard from "./milestone/MilestoneCard";
import MilestoneProgressBar from "./milestone/MilestoneProgressBar";

interface MilestonePaymentListProps {
  job: Job;
  bid: Bid;
  milestones: Milestone[];
  isJobOwner: boolean;
  isFreelancer: boolean;
  onInitiatePayment: (milestoneId: string) => Promise<void>;
  onPaymentComplete?: () => void;
}

export default function MilestonePaymentList({ 
  job, 
  bid, 
  milestones,
  isJobOwner,
  isFreelancer,
  onInitiatePayment,
  onPaymentComplete
}: MilestonePaymentListProps) {
  const [payingMilestoneId, setPayingMilestoneId] = useState<string | null>(null);
  const [releasingTransactionId, setReleasingTransactionId] = useState<string | null>(null);
  
  // Fetch transactions for this job to check milestone payment status
  const { data: transactions } = useQuery({
    queryKey: ["milestone-transactions", job.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("job_id", job.id)
        .not("milestone_id", "is", null);
        
      if (error) throw error;
      return data as Transaction[];
    },
  });

  const handlePayMilestone = async (milestoneId: string) => {
    setPayingMilestoneId(milestoneId);
    try {
      await onInitiatePayment(milestoneId);
    } finally {
      setPayingMilestoneId(null);
    }
  };
  
  const handleReleaseMilestonePayment = async (transactionId: string) => {
    if (!isJobOwner) return;
    
    setReleasingTransactionId(transactionId);
    try {
      // Get auth token for the edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found");
      }
      
      // Call our edge function to release payment
      const response = await fetch(`https://tjdnpprinmfopgcrqtbe.supabase.co/functions/v1/chip-payment/release-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          transactionId: transactionId,
          jobId: job.id
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Payment release failed');
      }
      
      if (result.warning) {
        toast.warning("Payment marked as released, but there was an issue with fund disbursement.");
      } else {
        toast.success("Milestone payment released successfully to freelancer!");
      }
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    } catch (error) {
      console.error("Payment release error:", error);
      toast.error(error.message || "Failed to release payment");
    } finally {
      setReleasingTransactionId(null);
    }
  };

  // Function to get transaction status for a milestone
  const getMilestoneTransaction = (milestoneId: string) => {
    if (!transactions) return null;
    return transactions.find(t => t.milestone_id === milestoneId) || null;
  };

  // Calculate the total amount paid so far
  const totalPaid = transactions?.reduce((sum, t) => {
    if (t.status === 'completed' || t.status === 'released' || t.status === 'disbursed') {
      return sum + Number(t.amount);
    }
    return sum;
  }, 0) || 0;

  // Calculate the total budget amount for all milestones
  const totalBudget = milestones.reduce((sum, m) => sum + Number(m.amount), 0);

  return (
    <Card>
      <CardHeader className="bg-blue-50 border-b">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
          <CardTitle className="text-lg">Milestone Payments</CardTitle>
        </div>
        <CardDescription>
          Pay and track progress for each milestone in this job
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <MilestoneProgressBar 
          totalPaid={totalPaid} 
          totalBudget={totalBudget} 
          job={job} 
        />

        <div className="space-y-4">
          {milestones.map((milestone) => {
            const transaction = getMilestoneTransaction(milestone.id);
            
            return (
              <MilestoneCard
                key={milestone.id}
                job={job}
                bid={bid}
                milestone={milestone}
                transaction={transaction}
                isJobOwner={isJobOwner}
                isFreelancer={isFreelancer}
                payingMilestoneId={payingMilestoneId}
                releasingTransactionId={releasingTransactionId}
                onPayMilestone={handlePayMilestone}
                onReleasePayment={handleReleaseMilestonePayment}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
