/**
 * Centralized logging utility with different log levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : '';
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    
    return `${timestamp} ${level}${context}: ${entry.message}${data}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private log(level: LogLevel, message: string, context?: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {return;}

    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
      case LogLevel.INFO:
        if (this.isDevelopment) {
          console.info(formattedMessage);
        }
        break;
      case LogLevel.WARN:
        if (this.isDevelopment) {
          console.warn(formattedMessage);
        } else {
          // Production: structured logging for warnings
          console.warn(JSON.stringify({
            level: 'WARN',
            message: entry.message,
            context: entry.context,
            timestamp: entry.timestamp
          }));
        }
        break;
      case LogLevel.ERROR:
        if (this.isDevelopment) {
          console.error(formattedMessage);
        } else {
          // Production: structured logging for errors
          console.error(JSON.stringify({
            level: 'ERROR',
            message: entry.message,
            context: entry.context,
            timestamp: entry.timestamp,
            data: entry.data
          }));
        }
        break;
    }

    // In production, you might want to send logs to a service like Sentry, LogRocket, etc.
    if (!this.isDevelopment && level >= LogLevel.ERROR) {
      this.sendToLoggingService(entry);
    }
  }

  private sendToLoggingService(_entry: LogEntry): void {
    // TODO: Implement logging service integration
    // Example: Sentry, LogRocket, or custom logging endpoint
    // This is where you'd send logs to your preferred logging service
  }

  debug(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  // Convenience methods for common use cases
  logError(error: unknown, context?: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorData = error instanceof Error ? { 
      name: error.name, 
      stack: error.stack 
    } : undefined;
    
    this.error(errorMessage, context, errorData);
  }

  logApiCall(endpoint: string, method: string, status?: number, duration?: number): void {
    this.info(`API ${method} ${endpoint}`, 'API', {
      method,
      endpoint,
      status,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  logUserAction(action: string, userId?: string, data?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, 'USER_ACTION', {
      action,
      userId,
      ...data,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: string, data?: Record<string, unknown>): void => 
  logger.debug(message, context, data);

export const logInfo = (message: string, context?: string, data?: Record<string, unknown>): void => 
  logger.info(message, context, data);

export const logWarn = (message: string, context?: string, data?: Record<string, unknown>): void => 
  logger.warn(message, context, data);

export const logError = (message: string, context?: string, data?: Record<string, unknown>): void => 
  logger.error(message, context, data);

export const logException = (error: unknown, context?: string): void => 
  logger.logError(error, context); 