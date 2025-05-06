
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  isBetaTester: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<any>) => Promise<void>;
  setUserType: (type: 'freelancer' | 'job_poster') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBetaTester, setIsBetaTester] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Defer profile fetch to avoid deadlock
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
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
        fetchUserProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      setProfile(profileData);
      setIsBetaTester(profileData.is_beta_tester);
      
      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();
      
      setIsAdmin(!!adminData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
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
      if (error) throw error;
      toast.success('Signed up successfully! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Error sending reset password email');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<any>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile({ ...profile, ...data });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      throw error;
    }
  };

  const setUserType = async (type: 'freelancer' | 'job_poster') => {
    try {
      if (!user) throw new Error('No user logged in');
      
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
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('job_poster_profiles')
          .upsert({ 
            id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      // Refetch profile to get updated data
      fetchUserProfile(user.id);
      
    } catch (error: any) {
      toast.error(error.message || 'Error setting user type');
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
