import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireBetaAccess?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireBetaAccess = false,
  requireAdmin = false,
  redirectTo = '/auth/login',
  fallback = <LoadingSpinner />
}: AuthGuardProps): JSX.Element | null {
  const { user, isLoading, isBetaTester, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Not logged in but auth is required
    if (requireAuth && !user) {
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Logged in but shouldn't be (e.g., on login page)
    if (!requireAuth && user) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Beta access check
    if (requireBetaAccess && !isBetaTester) {
      navigate('/', { replace: true });
      return;
    }

    // Admin access check
    if (requireAdmin && !isAdmin) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [user, isLoading, isBetaTester, isAdmin, requireAuth, requireBetaAccess, requireAdmin, navigate, redirectTo, location]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">{fallback}</div>;
  }

  // Show loading spinner while redirecting
  if (requireAuth && !user) {
    return <div className="flex items-center justify-center min-h-screen">{fallback}</div>;
  }

  // Show loading spinner while redirecting logged-in users away
  if (!requireAuth && user) {
    return <div className="flex items-center justify-center min-h-screen">{fallback}</div>;
  }

  // Show loading spinner while checking beta/admin access
  if ((requireBetaAccess && !isBetaTester) || (requireAdmin && !isAdmin)) {
    return <div className="flex items-center justify-center min-h-screen">{fallback}</div>;
  }

  return <>{children}</>;
} 