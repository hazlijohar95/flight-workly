import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WaitlistPage from "./pages/WaitlistPage";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import BetaAccess from "./pages/BetaAccess";
import BetaInvites from "./pages/dashboard/admin/BetaInvites";
import Settings from "./pages/dashboard/Settings";
import JobsListPage from "./pages/jobs/JobsListPage";
import NewJobPage from "./pages/jobs/NewJobPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import PaymentSuccessPage from "./pages/jobs/PaymentSuccessPage";
import PaymentFailedPage from "./pages/jobs/PaymentFailedPage";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Keep waitlist page for redirection purposes */}
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/home" element={<Index />} />
            <Route path="/beta" element={<Navigate to="/auth/signup" replace />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
            
            {/* Dashboard routes - protected */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            
            {/* Jobs routes */}
            <Route path="/dashboard/jobs" element={<JobsListPage />} />
            <Route path="/dashboard/jobs/new" element={<NewJobPage />} />
            <Route path="/dashboard/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/dashboard/jobs/:jobId/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/dashboard/jobs/:jobId/payment-failed" element={<PaymentFailedPage />} />
            
            {/* Admin routes */}
            <Route path="/dashboard/admin/invites" element={<BetaInvites />} />
            <Route path="/dashboard/admin/users" element={<BetaInvites />} /> {/* Placeholder */}
            
            {/* Redirect /auth to /auth/login */}
            <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
