
import { Link, useParams } from "react-router-dom";
import { XCircle } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentFailedPage(): JSX.Element {
  const { jobId } = useParams<{ jobId: string }>();

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 text-center">
          <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          
          <p className="text-muted-foreground mb-6">
            We were unable to process your payment. Please try again or use a different payment method.
          </p>
          
          <div className="space-y-4">
            <Link to={`/dashboard/jobs/${jobId}`}>
              <Button className="w-full">
                Try Again
              </Button>
            </Link>
            
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
