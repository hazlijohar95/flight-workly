
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, CreditCard, Loader2 } from "lucide-react";

import { Job, Bid, Milestone, Transaction } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TransactionDetails from "./TransactionDetails";

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
        .is("milestone_id", "not.null");
        
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
  const getMilestonePaymentStatus = (milestoneId: string) => {
    if (!transactions) return null;
    return transactions.find(t => t.milestone_id === milestoneId);
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
        <div className="bg-muted/20 p-3 rounded-md mb-4 text-sm">
          <div className="flex justify-between">
            <span>Total paid so far:</span>
            <span className="font-medium">{job.currency} {totalPaid.toFixed(2)} of {totalBudget.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, (totalPaid / totalBudget) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {milestones.map((milestone) => {
            const transaction = getMilestonePaymentStatus(milestone.id);
            const isPaid = transaction && (transaction.status === 'completed' || transaction.status === 'released' || transaction.status === 'disbursed');
            const isInEscrow = transaction && transaction.status === 'completed';
            const isDisbursed = transaction && transaction.status === 'disbursed';
            
            return (
              <Card key={milestone.id} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{milestone.title}</CardTitle>
                    <Badge 
                      variant={
                        isDisbursed ? "success" : 
                        isPaid ? "default" : 
                        "outline"
                      }
                    >
                      {isDisbursed ? "Paid" : 
                       isInEscrow ? "In Escrow" : 
                       "Unpaid"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3 pt-1">
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                  )}
                  
                  <div className="flex justify-between text-sm font-medium mb-3">
                    <span>Amount:</span>
                    <span>{job.currency} {Number(milestone.amount).toFixed(2)}</span>
                  </div>
                  
                  {transaction && (
                    <TransactionDetails 
                      bid={bid}
                      transaction={transaction}
                      currency={job.currency}
                      compact={true}
                    />
                  )}
                  
                  {isJobOwner && job.status === "in_progress" && !isPaid && (
                    <Button
                      className="w-full mt-3"
                      disabled={!!payingMilestoneId}
                      onClick={() => handlePayMilestone(milestone.id)}
                    >
                      {payingMilestoneId === milestone.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" /> Pay This Milestone
                        </>
                      )}
                    </Button>
                  )}
                  
                  {isJobOwner && isInEscrow && (
                    <Button
                      className="w-full mt-3"
                      disabled={!!releasingTransactionId}
                      onClick={() => handleReleaseMilestonePayment(transaction.id)}
                    >
                      {releasingTransactionId === transaction.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Releasing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Release Payment
                        </>
                      )}
                    </Button>
                  )}
                  
                  {isFreelancer && isInEscrow && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-800">
                        This milestone payment is in escrow and waiting to be released by the client.
                      </p>
                    </div>
                  )}
                  
                  {isFreelancer && isDisbursed && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200">
                      <p className="text-sm text-green-800">
                        This milestone payment has been sent to your account.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
