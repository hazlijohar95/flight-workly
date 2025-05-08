
import { ReactNode } from "react";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface PaymentErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  showCard?: boolean;
}

export default function PaymentErrorBoundary({
  children,
  onReset,
  showCard = true
}: PaymentErrorBoundaryProps) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    toast.info("Payment system refreshed");
  };

  // Create the fallback component based on props
  const ErrorFallback = ({ error }: { error: Error }) => {
    if (showCard) {
      return (
        <Card className="mb-4">
          <CardHeader className="bg-red-50 border-b">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <CardTitle className="text-lg">Payment System Error</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              There was a problem with the payment system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              We encountered an issue while processing your request. This could be due to a network 
              issue or a temporary problem with our payment provider.
            </p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded border">
              {error.message || "Unknown error"}
            </p>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              className="w-full"
              onClick={handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Payment System
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md my-4">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <h4 className="font-medium">Payment Error</h4>
        </div>
        <p className="text-sm text-red-700 mb-3">
          {error.message || "There was an issue with the payment system"}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReset}
        >
          <RefreshCw className="mr-2 h-3 w-3" /> Try again
        </Button>
      </div>
    );
  };

  return (
    <ErrorBoundary
      fallback={ErrorFallback}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
}
