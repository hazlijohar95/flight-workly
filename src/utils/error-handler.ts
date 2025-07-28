import { toast } from 'sonner';
import { logException } from './logger';
import type { AppError } from '@/types';

/**
 * Centralized error handling utility
 */
export class ErrorHandler {
  /**
   * Handle and display errors consistently
   */
  static handle(error: unknown, context?: string): void {
    const errorMessage = this.extractErrorMessage(error);
    const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;

    // Log error for debugging
    logException(error, context);

    // Show user-friendly error message
    toast.error(fullMessage);
  }

  /**
   * Extract error message from various error types
   */
  static extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }

    return 'An unexpected error occurred';
  }

  /**
   * Create a standardized error object
   */
  static createError(message: string, code?: string, details?: Record<string, unknown>): AppError {
    return {
      message,
      code,
      details,
    };
  }

  /**
   * Handle async operations with error catching
   */
  static async wrap<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context);
      return null;
    }
  }

  /**
   * Handle async operations that return void
   */
  static async wrapVoid(
    operation: () => Promise<void>,
    context?: string
  ): Promise<boolean> {
    try {
      await operation();
      return true;
    } catch (error) {
      this.handle(error, context);
      return false;
    }
  }
}

/**
 * Custom error classes for specific error types
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
} 