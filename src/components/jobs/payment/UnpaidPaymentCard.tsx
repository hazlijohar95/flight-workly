
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bid } from "@/types/job";
import TransactionDetails from "./TransactionDetails";

interface UnpaidPaymentCardProps {
  bid: Bid;
  currency: string;
  isProcessing: boolean;
  onInitiatePayment: () => Promise<void>;
}

export default function UnpaidPaymentCard({ 
  bid, 
  currency, 
  isProcessing,
  onInitiatePayment 
}: UnpaidPaymentCardProps) {
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
        <TransactionDetails bid={bid} currency={currency} />
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md border">
          <p className="text-sm text-muted-foreground">
            Your payment will be securely held in escrow until the job is complete. Then you can release it to the freelancer.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button
          onClick={onInitiatePayment}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
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
