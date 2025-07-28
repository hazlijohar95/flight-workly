
import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Transaction, Bid } from "@/types/job";
import TransactionDetails from "./TransactionDetails";

interface CompletedPaymentCardProps {
  bid: Bid;
  transaction: Transaction;
  currency: string;
  isFreelancer: boolean;
}

export default function CompletedPaymentCard({ 
  bid, 
  transaction, 
  currency,
  isFreelancer 
}: CompletedPaymentCardProps): JSX.Element {
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
        <TransactionDetails 
          bid={bid} 
          transaction={transaction} 
          currency={currency} 
        />
        
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
