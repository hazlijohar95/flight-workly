/**
 * Session storage utilities for better auth state management
 */

import { logWarn } from './logger';

const SESSION_KEY = 'flight_workly_session';
const USER_PREFERENCES_KEY = 'flight_workly_preferences';

interface SessionData {
  lastActivity: number;
  userAgent: string;
  loginTime: number;
}

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
  };
}

/**
 * Store session data
 */
export const storeSessionData = (data: Partial<SessionData>): void => {
  try {
    const existing = getSessionData();
    const sessionData: SessionData = {
      lastActivity: Date.now(),
      userAgent: navigator.userAgent,
      loginTime: Date.now(),
      ...existing,
      ...data,
    };
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    logWarn('Failed to store session data', 'SessionStorage', { error: String(error) });
  }
};

/**
 * Get session data
 */
export const getSessionData = (): SessionData | null => {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logWarn('Failed to get session data', 'SessionStorage', { error: String(error) });
    return null;
  }
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = (): void => {
  const existing = getSessionData();
  if (existing) {
    storeSessionData({ lastActivity: Date.now() });
  }
};

/**
 * Check if session is still valid (within 24 hours)
 */
export const isSessionValid = (): boolean => {
  const sessionData = getSessionData();
  if (!sessionData) {
    return false;
  }
  
  const now = Date.now();
  const sessionAge = now - sessionData.loginTime;
  const lastActivityAge = now - sessionData.lastActivity;
  
  // Session expires after 24 hours
  const maxSessionAge = 24 * 60 * 60 * 1000;
  // Inactivity timeout after 30 minutes
  const inactivityTimeout = 30 * 60 * 1000;
  
  return sessionAge < maxSessionAge && lastActivityAge < inactivityTimeout;
};

/**
 * Clear session data
 */
export const clearSessionData = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    logWarn('Failed to clear session data', 'SessionStorage', { error: String(error) });
  }
};

/**
 * Store user preferences
 */
export const storeUserPreferences = (preferences: Partial<UserPreferences>): void => {
  try {
    const existing = getUserPreferences();
    const userPreferences: UserPreferences = {
      theme: 'system',
      language: 'en',
      notifications: {
        email: true,
        push: false,
      },
      ...existing,
      ...preferences,
    };
    
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(userPreferences));
  } catch (error) {
    logWarn('Failed to store user preferences', 'SessionStorage', { error: String(error) });
  }
};

/**
 * Get user preferences
 */
export const getUserPreferences = (): UserPreferences | null => {
  try {
    const data = localStorage.getItem(USER_PREFERENCES_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logWarn('Failed to get user preferences', 'SessionStorage', { error: String(error) });
    return null;
  }
};

/**
 * Clear user preferences
 */
export const clearUserPreferences = (): void => {
  try {
    localStorage.removeItem(USER_PREFERENCES_KEY);
  } catch (error) {
    logWarn('Failed to clear user preferences', 'SessionStorage', { error: String(error) });
  }
};

/**
 * Clear all stored data (useful for logout)
 */
export const clearAllStoredData = (): void => {
  clearSessionData();
  clearUserPreferences();
};

/**
 * Set up activity tracking
 */
export const setupActivityTracking = (): (() => void) => {
  const updateActivity = () => updateLastActivity();
  
  // Track various user activities
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });
  
  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, updateActivity);
    });
  };
}; 