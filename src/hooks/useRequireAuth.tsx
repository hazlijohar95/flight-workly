
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireBetaAccess?: boolean;
  requireAdmin?: boolean;
}

export function useRequireAuth({
  redirectTo = '/auth/login',
  requireBetaAccess = false,
  requireAdmin = false,
}: UseRequireAuthOptions = {}) {
  const { user, isLoading, isBetaTester, isAdmin, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize
    
    // Not logged in
    if (!user) {
      navigate(redirectTo);
      return;
    }
    
    // Beta access check - only perform if specifically required
    if (requireBetaAccess && !isBetaTester) {
      navigate('/');
      return;
    }
    
    // Admin check - only perform if specifically required
    if (requireAdmin && !isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isLoading, isBetaTester, isAdmin, navigate, redirectTo, requireBetaAccess, requireAdmin]);

  // Return all necessary auth context properties
  return { user, isLoading, isBetaTester, isAdmin, profile, updateProfile };
}

export default useRequireAuth;
