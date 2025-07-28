import { logWarn } from '@/utils/logger';

// Environment variables with fallbacks
export const CONFIG = {
  // Supabase Configuration - REQUIRED
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,

  // Application Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "Flight Workly",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  APP_ENV: import.meta.env.VITE_APP_ENV || "development",

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",

  // External Services
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
} as const;

// Validation function to ensure required environment variables are set
export const validateConfig = (): void => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}. Application cannot start.`;
    logWarn(errorMessage, 'CONFIG');
    throw new Error(errorMessage);
  }

  // Validate Supabase URL format
  if (CONFIG.SUPABASE_URL && !CONFIG.SUPABASE_URL.includes('supabase.co')) {
    const errorMessage = 'Invalid Supabase URL format. Must be a valid Supabase project URL.';
    logWarn(errorMessage, 'CONFIG');
    throw new Error(errorMessage);
  }

  // Validate Supabase key format
  if (CONFIG.SUPABASE_ANON_KEY && !CONFIG.SUPABASE_ANON_KEY.startsWith('eyJ')) {
    const errorMessage = 'Invalid Supabase anon key format. Must be a valid JWT token.';
    logWarn(errorMessage, 'CONFIG');
    throw new Error(errorMessage);
  }
};

// Call validation on import - enabled for production
validateConfig(); 