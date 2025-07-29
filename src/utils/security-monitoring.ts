import { logInfo, logWarn, logError } from '@/utils/logger';

/**
 * Security monitoring service for real-time security monitoring
 */

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'critical';
  category: 'authentication' | 'authorization' | 'input_validation' | 'data_protection' | 'infrastructure';
  message: string;
  details?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  failedLogins: number;
  suspiciousActivities: number;
  blockedRequests: number;
  lastUpdated: Date;
}

class SecurityMonitoringService {
  private events: SecurityEvent[] = [];
  private metrics: SecurityMetrics = {
    totalEvents: 0,
    criticalEvents: 0,
    failedLogins: 0,
    suspiciousActivities: 0,
    blockedRequests: 0,
    lastUpdated: new Date(),
  };

  private maxEvents = 1000; // Keep last 1000 events
  private alertThresholds = {
    failedLogins: 5, // Alert after 5 failed logins
    suspiciousActivities: 3, // Alert after 3 suspicious activities
    criticalEvents: 1, // Alert after 1 critical event
  };

  /**
   * Record a security event
   */
  recordEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.events.push(securityEvent);
    this.updateMetrics(securityEvent);
    this.checkAlertThresholds(securityEvent);

    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log the event
    this.logEvent(securityEvent);
  }

  /**
   * Record authentication event
   */
  recordAuthEvent(
    type: 'login_success' | 'login_failure' | 'logout' | 'password_reset' | 'account_locked',
    userId?: string,
    details?: Record<string, unknown>
  ): void {
    const eventType = type === 'login_failure' ? 'warning' : 'info';
    const category = 'authentication';

    this.recordEvent({
      type: eventType,
      category,
      message: `Authentication event: ${type}`,
      userId,
      details,
    });
  }

  /**
   * Record input validation event
   */
  recordValidationEvent(
    type: 'xss_attempt' | 'sql_injection_attempt' | 'invalid_input' | 'file_upload_violation',
    input: string,
    details?: Record<string, unknown>
  ): void {
    const eventType = type.includes('attempt') ? 'warning' : 'info';
    const category = 'input_validation';

    this.recordEvent({
      type: eventType,
      category,
      message: `Input validation event: ${type}`,
      details: {
        ...details,
        input: this.sanitizeInput(input),
      },
    });
  }

  /**
   * Record suspicious activity
   */
  recordSuspiciousActivity(
    type: 'unusual_access_pattern' | 'multiple_failed_attempts' | 'unusual_location' | 'unusual_time',
    details?: Record<string, unknown>
  ): void {
    this.recordEvent({
      type: 'warning',
      category: 'authorization',
      message: `Suspicious activity detected: ${type}`,
      details,
    });
  }

  /**
   * Record critical security event
   */
  recordCriticalEvent(
    type: 'data_breach' | 'unauthorized_access' | 'system_compromise' | 'malware_detected',
    details?: Record<string, unknown>
  ): void {
    this.recordEvent({
      type: 'critical',
      category: 'data_protection',
      message: `Critical security event: ${type}`,
      details,
    });
  }

  /**
   * Get security metrics
   */
  getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Get events by category
   */
  getEventsByCategory(category: SecurityEvent['category']): SecurityEvent[] {
    return this.events.filter(event => event.category === category);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Clear old events
   */
  clearOldEvents(olderThanHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoffTime);
  }

  /**
   * Export events for analysis
   */
  exportEvents(): SecurityEvent[] {
    return [...this.events];
  }

  /**
   * Private methods
   */
  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateMetrics(event: SecurityEvent): void {
    this.metrics.totalEvents++;
    this.metrics.lastUpdated = new Date();

    switch (event.type) {
      case 'critical':
        this.metrics.criticalEvents++;
        break;
    }

    switch (event.category) {
      case 'authentication':
        if (event.message.includes('login_failure')) {
          this.metrics.failedLogins++;
        }
        break;
      case 'authorization':
        if (event.message.includes('Suspicious activity')) {
          this.metrics.suspiciousActivities++;
        }
        break;
    }
  }

  private checkAlertThresholds(event: SecurityEvent): void {
    // Check failed login threshold
    if (this.metrics.failedLogins >= this.alertThresholds.failedLogins) {
      this.triggerAlert('Failed login threshold exceeded', {
        failedLogins: this.metrics.failedLogins,
        threshold: this.alertThresholds.failedLogins,
      });
    }

    // Check suspicious activities threshold
    if (this.metrics.suspiciousActivities >= this.alertThresholds.suspiciousActivities) {
      this.triggerAlert('Suspicious activities threshold exceeded', {
        suspiciousActivities: this.metrics.suspiciousActivities,
        threshold: this.alertThresholds.suspiciousActivities,
      });
    }

    // Check critical events threshold
    if (this.metrics.criticalEvents >= this.alertThresholds.criticalEvents) {
      this.triggerAlert('Critical events threshold exceeded', {
        criticalEvents: this.metrics.criticalEvents,
        threshold: this.alertThresholds.criticalEvents,
      });
    }
  }

  private triggerAlert(message: string, details: Record<string, unknown>): void {
    logError(`Security Alert: ${message}`, 'SecurityMonitoring', details);
    
    // In a real implementation, this would send alerts to:
    // - Security team
    // - Monitoring systems
    // - Incident response team
    // - Logging services
  }

  private logEvent(event: SecurityEvent): void {
    const logData = {
      eventId: event.id,
      type: event.type,
      category: event.category,
      message: event.message,
      userId: event.userId,
      timestamp: event.timestamp.toISOString(),
      ...event.details,
    };

    switch (event.type) {
      case 'critical':
        logError(event.message, 'SecurityMonitoring', logData);
        break;
      case 'warning':
        logWarn(event.message, 'SecurityMonitoring', logData);
        break;
      case 'info':
        logInfo(event.message, 'SecurityMonitoring', logData);
        break;
    }
  }

  private sanitizeInput(input: string): string {
    // Remove sensitive information from logs
    return input
      .replace(/password\s*=\s*[^\s]+/gi, 'password=***')
      .replace(/token\s*=\s*[^\s]+/gi, 'token=***')
      .replace(/key\s*=\s*[^\s]+/gi, 'key=***')
      .substring(0, 100); // Limit length
  }
}

// Export singleton instance
export const securityMonitoring = new SecurityMonitoringService();

/**
 * Security monitoring hooks for React components
 */
export function useSecurityMonitoring() {
  return {
    recordAuthEvent: securityMonitoring.recordAuthEvent.bind(securityMonitoring),
    recordValidationEvent: securityMonitoring.recordValidationEvent.bind(securityMonitoring),
    recordSuspiciousActivity: securityMonitoring.recordSuspiciousActivity.bind(securityMonitoring),
    recordCriticalEvent: securityMonitoring.recordCriticalEvent.bind(securityMonitoring),
    getMetrics: securityMonitoring.getMetrics.bind(securityMonitoring),
    getRecentEvents: securityMonitoring.getRecentEvents.bind(securityMonitoring),
  };
} 