
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { Job, Bid, Milestone, Transaction } from "@/types/job";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TransactionDetails from "../TransactionDetails";

interface MilestoneCardProps {
  job: Job;
  bid: Bid;
  milestone: Milestone;
  transaction: Transaction | null;
  isJobOwner: boolean;
  isFreelancer: boolean;
  payingMilestoneId: string | null;
  releasingTransactionId: string | null;
  onPayMilestone: (milestoneId: string) => void;
  onReleasePayment: (transactionId: string) => void;
}

export default function MilestoneCard({
  job,
  bid,
  milestone,
  transaction,
  isJobOwner,
  isFreelancer,
  payingMilestoneId,
  releasingTransactionId,
  onPayMilestone,
  onReleasePayment
}: MilestoneCardProps): JSX.Element {
  // Determine milestone payment status
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
            onClick={() => onPayMilestone(milestone.id)}
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
            onClick={() => onReleasePayment(transaction.id)}
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
}
