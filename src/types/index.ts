// Re-export all types
export * from './job';

// User and Profile Types
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  user_type?: 'freelancer' | 'job_poster' | null;
  is_beta_tester: boolean;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfile {
  id: string;
  skills: string[];
  hourly_rate?: number;
  portfolio_url?: string;
  experience_years?: number;
  created_at: string;
  updated_at: string;
}

export interface JobPosterProfile {
  id: string;
  company_name?: string;
  company_size?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithId {
  id: string;
}

export interface WithTimestamps {
  created_at: string;
  updated_at: string;
} 