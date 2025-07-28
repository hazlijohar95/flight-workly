# 🚀 Production Environment Setup

## Required Environment Variables

Create a `.env.production` file in the root directory with the following variables:

```bash
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
VITE_APP_NAME=Flight Workly
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false

# External Services
VITE_API_BASE_URL=https://your-api-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key

# Error Tracking (Optional but recommended)
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_LOGROCKET_APP_ID=your-logrocket-app-id

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Setup Instructions

1. **Copy the template above** to `.env.production`
2. **Replace placeholder values** with your actual production credentials
3. **Never commit** `.env.production` to version control
4. **Add `.env.production`** to your `.gitignore` file

## Critical Variables

- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous key
- **VITE_APP_ENV**: Must be set to "production"

## Optional but Recommended

- **VITE_SENTRY_DSN**: For error tracking
- **VITE_LOGROCKET_APP_ID**: For session replay
- **VITE_GOOGLE_ANALYTICS_ID**: For user analytics 