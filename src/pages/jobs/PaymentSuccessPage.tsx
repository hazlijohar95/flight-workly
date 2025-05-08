
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Job, Transaction } from "@/types/job";

export default function PaymentSuccessPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useRequireAuth({ requireBetaAccess: true });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: transaction, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["transaction", jobId],
    queryFn: async () => {
      if (!jobId || !user) return null;
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("job_id", jobId)
        .eq("payer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
        
      if (error) throw error;
      return data[0] as Transaction | null;
    },
    enabled: !!jobId && !!user,
  });
  
  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      if (!jobId) return null;
      
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
        
      if (error) throw error;
      return data as Job;
    },
    enabled: !!jobId,
  });
  
  // Update payment status if needed
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!transaction || !transaction.chip_transaction_id || !user) return;
      
      try {
        // Get auth token for the edge function
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error("No active session found");
        }
        
        // Call our edge function to check payment status
        const response = await fetch(`https://tjdnpprinmfopgcrqtbe.supabase.co/functions/v1/chip-payment/check-payment-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            chipTransactionId: transaction.chip_transaction_id
          })
        });
        
        await response.json();
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["job", jobId] });
        queryClient.invalidateQueries({ queryKey: ["transaction", jobId] });
        
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };
    
    checkPaymentStatus();
  }, [transaction, jobId, user, queryClient]);

  if (isLoadingTransaction) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Verifying payment status...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 text-center">
          <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          
          <p className="text-muted-foreground mb-6">
            Your payment has been processed successfully and is now held in escrow until the job is completed.
          </p>
          
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => navigate(`/dashboard/jobs/${jobId}`)}
            >
              View Job Details
            </Button>
            
            <Link to="/dashboard/jobs">
              <Button variant="outline" className="w-full">
                Return to Jobs
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
