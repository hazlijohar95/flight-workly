import { logException, logInfo, logWarn, logError } from './logger';

// Basic error monitoring interface
interface ErrorMonitoringService {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
  setUser(userId: string, userData?: Record<string, unknown>): void;
  setTag(key: string, value: string): void;
}

// Simple console-based error monitoring (for development/testing)
class ConsoleErrorMonitoring implements ErrorMonitoringService {
  captureException(error: Error, context?: Record<string, unknown>): void {
    logError('Error Captured', 'ErrorMonitoring', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
    
    // Also log to our centralized logger
    logException(error, 'ErrorMonitoring');
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    const logFunction = level === 'error' ? logError : level === 'warning' ? logWarn : logInfo;
    logFunction(`${level.toUpperCase()}: ${message}`, 'ErrorMonitoring', {
      timestamp: new Date().toISOString(),
    });
  }

  setUser(userId: string, userData?: Record<string, unknown>): void {
    logInfo('User Set', 'ErrorMonitoring', { userId, userData });
  }

  setTag(key: string, value: string): void {
    logInfo('Tag Set', 'ErrorMonitoring', { key, value });
  }
}

// Production-ready error monitoring (placeholder for Sentry/LogRocket)
class ProductionErrorMonitoring implements ErrorMonitoringService {
  captureException(error: Error, context?: Record<string, unknown>): void {
    // TODO: Implement with actual error tracking service (Sentry, LogRocket, etc.)
    logError('Production Error', 'ErrorMonitoring', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
    
    // Also log to our centralized logger
    logException(error, 'ErrorMonitoring');
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    // TODO: Implement with actual error tracking service
    const logFunction = level === 'error' ? logError : level === 'warning' ? logWarn : logInfo;
    logFunction(`${level.toUpperCase()}: ${message}`, 'ErrorMonitoring');
  }

  setUser(userId: string, userData?: Record<string, unknown>): void {
    // TODO: Implement with actual error tracking service
    logInfo('User Set', 'ErrorMonitoring', { userId, userData });
  }

  setTag(key: string, value: string): void {
    // TODO: Implement with actual error tracking service
    logInfo('Tag Set', 'ErrorMonitoring', { key, value });
  }
}

// Create the appropriate error monitoring instance
const createErrorMonitoring = (): ErrorMonitoringService => {
  const isProduction = import.meta.env.PROD;
  const enableErrorMonitoring = import.meta.env.VITE_ENABLE_ERROR_MONITORING === 'true';
  
  if (isProduction && enableErrorMonitoring) {
    return new ProductionErrorMonitoring();
  }
  
  return new ConsoleErrorMonitoring();
};

// Export the error monitoring instance
export const errorMonitoring = createErrorMonitoring();

// Export types for use in components
export type { ErrorMonitoringService };

// Utility functions for easy use
export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  errorMonitoring.captureException(error, context);
};

export const captureMessage = (message: string, level?: 'info' | 'warning' | 'error'): void => {
  errorMonitoring.captureMessage(message, level);
};

export const setUser = (userId: string, userData?: Record<string, unknown>): void => {
  errorMonitoring.setUser(userId, userData);
};

export const setTag = (key: string, value: string): void => {
  errorMonitoring.setTag(key, value);
}; 