import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AuthGuard from "@/components/AuthGuard";
import { captureMessage, setTag } from "@/utils/error-monitoring";

// Lazy load components for code splitting
const LandingPage = React.lazy(() => import("@/pages/LandingPage"));
const Login = React.lazy(() => import("@/pages/auth/Login"));
const Signup = React.lazy(() => import("@/pages/auth/Signup"));
const ForgotPassword = React.lazy(() => import("@/pages/auth/ForgotPassword"));
const VerifyEmail = React.lazy(() => import("@/pages/auth/VerifyEmail"));
const ResetPassword = React.lazy(() => import("@/pages/auth/ResetPassword"));
const Dashboard = React.lazy(() => import("@/pages/dashboard/Dashboard"));
const Profile = React.lazy(() => import("@/pages/dashboard/Profile"));
const Settings = React.lazy(() => import("@/pages/dashboard/Settings"));
const JobsListPage = React.lazy(() => import("@/pages/jobs/JobsListPage"));
const JobDetailPage = React.lazy(() => import("@/pages/jobs/JobDetailPage"));
const NewJobPage = React.lazy(() => import("@/pages/jobs/NewJobPage"));
const JobHistoryPage = React.lazy(() => import("@/pages/jobs/JobHistoryPage"));
const PaymentSuccessPage = React.lazy(() => import("@/pages/jobs/PaymentSuccessPage"));
const PaymentFailedPage = React.lazy(() => import("@/pages/jobs/PaymentFailedPage"));
const WaitlistPage = React.lazy(() => import("@/pages/WaitlistPage"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const ServerError = React.lazy(() => import("@/pages/ServerError"));

// Layout components
const AuthLayout = React.lazy(() => import("@/components/AuthLayout"));
const DashboardLayout = React.lazy(() => import("@/components/DashboardLayout"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for Suspense fallback
const PageLoader = (): JSX.Element => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const App = (): JSX.Element => {
  // Initialize error monitoring
  useEffect(() => {
    // Set application tags
    setTag('app_name', 'Flight Workly');
    setTag('app_version', import.meta.env.VITE_APP_VERSION || '1.0.0');
    setTag('app_env', import.meta.env.VITE_APP_ENV || 'development');
    
    // Log app initialization
    captureMessage('Application initialized', 'info');
    
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      captureMessage(`Unhandled promise rejection: ${event.reason}`, 'error');
    };
    
    // Handle global errors
    const handleGlobalError = (event: ErrorEvent): void => {
      captureMessage(`Global error: ${event.message}`, 'error');
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/waitlist" element={<WaitlistPage />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth" element={<AuthLayout />}>
                      <Route path="login" element={
                        <AuthGuard requireAuth={false}>
                          <Login />
                        </AuthGuard>
                      } />
                      <Route path="signup" element={
                        <AuthGuard requireAuth={false}>
                          <Signup />
                        </AuthGuard>
                      } />
                      <Route path="forgot-password" element={
                        <AuthGuard requireAuth={false}>
                          <ForgotPassword />
                        </AuthGuard>
                      } />
                      <Route path="verify-email" element={<VerifyEmail />} />
                      <Route path="reset-password" element={<ResetPassword />} />
                    </Route>
                    
                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard" element={
                      <AuthGuard requireAuth={true} requireBetaAccess={true}>
                        <DashboardLayout />
                      </AuthGuard>
                    }>
                      <Route index element={<Dashboard />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="jobs" element={<JobsListPage />} />
                      <Route path="jobs/new" element={<NewJobPage />} />
                      <Route path="jobs/history" element={<JobHistoryPage />} />
                    </Route>
                    
                    {/* Job Detail Routes */}
                    <Route path="/jobs/:jobId" element={
                      <AuthGuard requireAuth={true} requireBetaAccess={true}>
                        <JobDetailPage />
                      </AuthGuard>
                    } />
                    <Route path="/payment/success" element={
                      <AuthGuard requireAuth={true} requireBetaAccess={true}>
                        <PaymentSuccessPage />
                      </AuthGuard>
                    } />
                    <Route path="/payment/failed" element={
                      <AuthGuard requireAuth={true} requireBetaAccess={true}>
                        <PaymentFailedPage />
                      </AuthGuard>
                    } />
                    
                    {/* Fallback Routes */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="/500" element={<ServerError />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
