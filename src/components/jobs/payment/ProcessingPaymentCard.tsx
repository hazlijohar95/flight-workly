
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProcessingPaymentCard() {
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
