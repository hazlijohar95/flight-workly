
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; resetErrorBoundary: () => void }) => ReactNode);
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Handle function fallback
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary
        });
      }
      
      // Handle ReactNode fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p className="text-sm">{this.state.error?.message || "An unexpected error occurred"}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3" 
                onClick={this.resetErrorBoundary}
              >
                Try again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
