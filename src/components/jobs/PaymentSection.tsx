
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, CheckCircle, AlertCircle, Loader2, ArrowDownLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Job, Bid, Transaction } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface PaymentSectionProps {
  job: Job;
  bid: Bid | null;
  transaction?: Transaction;
  onPaymentComplete?: () => void;
}

export default function PaymentSection({ job, bid, transaction, onPaymentComplete }: PaymentSectionProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  
  // We need the accepted bid for payment
  if (!bid) {
    return null;
  }
  
  const isJobOwner = user?.id === job.user_id;
  const isFreelancer = bid && user?.id === bid.user_id;
  
  const handleInitiatePayment = async () => {
    if (!user || !profile) {
      toast.error("You must be logged in to make payments");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: freelancerData, error: freelancerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", bid.user_id)
        .single();
      
      if (freelancerError) {
        throw freelancerError;
      }
      
      // Get auth token for the edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found");
      }
      
      // Call our edge function to create payment
      const response = await fetch(`https://tjdnpprinmfopgcrqtbe.supabase.co/functions/v1/chip-payment/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          jobId: job.id,
          bidId: bid.id,
          amount: bid.fee,
          currency: job.currency,
          buyerName: `${profile.first_name} ${profile.last_name}`,
          buyerEmail: user.email,
          payeeId: bid.user_id,
          reference: `Job ${job.id.substring(0, 8)}`
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Payment initiation failed');
      }
      
      // Redirect to Chip payment page
      window.location.href = result.payment_url;
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReleasePayment = async () => {
    if (!user || !transaction) {
      return;
    }
    
    setIsReleasing(true);
    
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
          transactionId: transaction.id,
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
        toast.success("Payment released successfully to freelancer!");
      }
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
      
    } catch (error) {
      console.error("Payment release error:", error);
      toast.error(error.message || "Failed to release payment");
    } finally {
      setIsReleasing(false);
    }
  };
  
  // Different states based on payment status
  
  // Funds have been disbursed to the freelancer
  if (transaction?.status === 'disbursed') {
    return (
      <Card>
        <CardHeader className="bg-green-50 border-b">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <CardTitle className="text-lg">Payment Completed</CardTitle>
          </div>
          <CardDescription>
            The payment has been disbursed to the freelancer
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount</span>
              <span>{job.currency} {bid.fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Platform Fee</span>
              <span>{job.currency} {transaction?.fee_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold pt-2 border-t">
              <span>Total</span>
              <span>{job.currency} {(bid.fee + (transaction?.fee_amount || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-medium">Disbursed Date</span>
              <span>{transaction.disbursed_at ? new Date(transaction.disbursed_at).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
          
          {isFreelancer && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm text-green-800">
                Your payment has been sent to your registered bank account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Payment is in escrow (waiting to be released)
  if (job.payment_status === 'paid' && transaction?.status === 'completed') {
    return (
      <Card>
        <CardHeader className="bg-green-50 border-b">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <CardTitle className="text-lg">Payment in Escrow</CardTitle>
          </div>
          <CardDescription>
            The payment is securely held in escrow
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount</span>
              <span>{job.currency} {bid.fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Platform Fee</span>
              <span>{job.currency} {transaction?.fee_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold pt-2 border-t">
              <span>Total</span>
              <span>{job.currency} {(bid.fee + (transaction?.fee_amount || 0)).toFixed(2)}</span>
            </div>
          </div>
          
          {isJobOwner && job.status === 'in_progress' && (
            <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800">
                Once the job is complete, you can release the payment to the freelancer.
              </p>
            </div>
          )}
          
          {isFreelancer && job.status === 'in_progress' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                The client has funded this job. Payment will be released when the work is complete.
              </p>
            </div>
          )}
        </CardContent>
        
        {isJobOwner && job.status === 'in_progress' && (
          <CardFooter className="border-t pt-4">
            <Button
              onClick={handleReleasePayment}
              disabled={isReleasing}
              className="w-full"
            >
              {isReleasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Disbursement...
                </>
              ) : (
                <>
                  <ArrowDownLeft className="mr-2 h-4 w-4" /> Release Payment to Freelancer
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
  
  // Payment is being processed
  if (job.payment_status === 'processing') {
    return (
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
            <CardTitle className="text-lg">Payment Processing</CardTitle>
          </div>
          <CardDescription>
            Your payment is being processed
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            Please wait while we process your payment. This may take a few moments.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Default state - payment required
  if (isJobOwner && job.status === 'in_progress' && (!job.payment_status || job.payment_status === 'unpaid')) {
    return (
      <Card>
        <CardHeader className="bg-amber-50 border-b">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle className="text-lg">Payment Required</CardTitle>
          </div>
          <CardDescription>
            Payment is required to continue with the job
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount</span>
              <span>{job.currency} {bid.fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Platform Fee (5%)</span>
              <span>{job.currency} {(bid.fee * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold pt-2 border-t">
              <span>Total</span>
              <span>{job.currency} {(bid.fee * 1.05).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md border">
            <p className="text-sm text-muted-foreground">
              Your payment will be securely held in escrow until the job is complete. Then you can release it to the freelancer.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button
            onClick={handleInitiatePayment}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return null;
}
