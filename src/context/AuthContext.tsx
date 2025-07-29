
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logException, logWarn } from '@/utils/logger';
import { 
  storeSessionData, 
  setupActivityTracking,
  clearAllStoredData 
} from '@/utils/session-storage';
import type { UserProfile, FreelancerProfile, JobPosterProfile, AppError } from '@/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  freelancerProfile: FreelancerProfile | null;
  jobPosterProfile: JobPosterProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isBetaTester: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserType: (type: 'freelancer' | 'job_poster') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);
  const [jobPosterProfile, setJobPosterProfile] = useState<JobPosterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBetaTester, setIsBetaTester] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (userId: string): Promise<void> => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {throw profileError;}

      if (profileData) {
        setProfile(profileData as UserProfile);
        setIsBetaTester(profileData.is_beta_tester);

        // Fetch specialized profiles based on user type
        if (profileData.user_type === 'freelancer') {
          const { data: freelancerData } = await supabase
            .from('freelancer_profiles')
            .select('*')
            .eq('id', userId)
            .single();

          setFreelancerProfile(freelancerData as FreelancerProfile | null);
        } else if (profileData.user_type === 'job_poster') {
          const { data: jobPosterData } = await supabase
            .from('job_poster_profiles')
            .select('*')
            .eq('id', userId)
            .single();

          setJobPosterProfile(jobPosterData as JobPosterProfile | null);
        }
      }

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();

      setIsAdmin(!!adminData);
    } catch (error) {
      logException(error, 'fetchUserProfile');
      setProfile(null);
      setFreelancerProfile(null);
      setJobPosterProfile(null);
    }
  }, []);

  useEffect(() => {
    // Set up activity tracking
    const cleanupActivityTracking = setupActivityTracking();

              // Check if Supabase is configured
          if (!isSupabaseConfigured) {
            logWarn('Supabase is not configured. Authentication features will be disabled.');
            setIsLoading(false);
            return;
          }

    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Store session data on successful auth
          storeSessionData({ loginTime: Date.now() });
          
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          // Clear session data on logout
          clearAllStoredData();
          setProfile(null);
          setFreelancerProfile(null);
          setJobPosterProfile(null);
          setIsAdmin(false);
          setIsBetaTester(false);
        }
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        storeSessionData({ loginTime: Date.now() });
        fetchUserProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      cleanupActivityTracking();
    };
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {throw error;}
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: unknown) {
      const appError = error as AppError;
      const errorMessage = appError.message || 'Error signing in';
      
      // Handle specific auth errors
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('Please verify your email address before signing in');
      } else {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) {throw error;}
      toast.success('Signed up successfully! Please check your email for verification.');
    } catch (error: unknown) {
      const appError = error as AppError;
      const errorMessage = appError.message || 'Error signing up';
      
      // Handle specific signup errors
      if (errorMessage.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else if (errorMessage.includes('Password should be at least')) {
        toast.error('Password must be at least 6 characters long');
      } else {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {throw error;}
      
      // Clear all stored data
      clearAllStoredData();
      
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error(appError.message || 'Error signing out');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {throw error;}
      toast.success('Password reset email sent!');
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error(appError.message || 'Error sending reset password email');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    try {
      if (!user) {throw new Error('No user logged in');}

      const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {throw error;}

      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error(appError.message || 'Error updating profile');
      throw error;
    }
  };

  const setUserType = async (type: 'freelancer' | 'job_poster'): Promise<void> => {
    try {
      if (!user) {throw new Error('No user logged in');}

      // Update profile with user type
      await updateProfile({ user_type: type });

      // Create corresponding specialized profile if it doesn't exist
      if (type === 'freelancer') {
        const { error } = await supabase
          .from('freelancer_profiles')
          .upsert({
            id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {throw error;}
      } else {
        const { error } = await supabase
          .from('job_poster_profiles')
          .upsert({
            id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {throw error;}
      }

      // Refetch profile to get updated data
      await fetchUserProfile(user.id);

      // Show success toast
      toast.success(`Profile updated as ${type === 'freelancer' ? 'Freelancer' : 'Business'}`);

    } catch (error: unknown) {
      const appError = error as AppError;
      toast.error(appError.message || 'Error setting user type');
      throw error;
    }
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    freelancerProfile,
    jobPosterProfile,
    isLoading,
    isAdmin,
    isBetaTester,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    setUserType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
