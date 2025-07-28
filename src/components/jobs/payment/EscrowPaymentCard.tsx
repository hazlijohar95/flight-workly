
import { CheckCircle, ArrowDownLeft, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction, Bid, Job } from "@/types/job";
import TransactionDetails from "./TransactionDetails";

interface EscrowPaymentCardProps {
  job: Job;
  bid: Bid;
  transaction?: Transaction;
  isJobOwner: boolean;
  isFreelancer: boolean;
  isProcessing: boolean;
  onReleasePayment: () => Promise<void>;
}

export default function EscrowPaymentCard({ 
  job, 
  bid, 
  transaction, 
  isJobOwner, 
  isFreelancer,
  isProcessing,
  onReleasePayment
}: EscrowPaymentCardProps): JSX.Element {
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
        {transaction && (
          <TransactionDetails 
            bid={bid} 
            transaction={transaction} 
            currency={job.currency} 
          />
        )}
        
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
            onClick={onReleasePayment}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
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
