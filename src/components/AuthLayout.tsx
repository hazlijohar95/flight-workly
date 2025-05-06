
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import BackgroundCanvas from "@/components/BackgroundCanvas";

interface AuthLayoutProps {
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
}

const AuthLayout = ({
  requireAuth = false,
  redirectAuthenticatedTo = "/dashboard",
}: AuthLayoutProps) => {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect if user is already authenticated
  if (user && redirectAuthenticatedTo) {
    return <Navigate to={redirectAuthenticatedTo} replace />;
  }

  // Redirect if auth is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      
      <header className="container mx-auto pt-4 pb-2 px-4">
        <Logo showTagline={true} />
      </header>
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
