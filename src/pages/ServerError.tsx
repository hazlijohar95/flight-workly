import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

interface ServerErrorProps {
  error?: Error;
  resetError?: () => void;
}

export default function ServerError({ error, resetError }: ServerErrorProps): JSX.Element {
  const handleRetry = (): void => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Server Error</CardTitle>
          <CardDescription>
            We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Error 500</p>
            <p className="text-xs mt-1">Internal server error occurred.</p>
          </div>
          
          {error && process.env.NODE_ENV === "development" && (
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                Error Details (Development)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto">
                <div className="mb-2">
                  <strong>Error:</strong> {error.message}
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
          
          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Link to="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>If the problem persists, please contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 