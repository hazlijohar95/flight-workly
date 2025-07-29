import { z } from 'zod';
import DOMPurify from 'dompurify';

/**
 * Security utilities for input validation, sanitization, and security measures
 */

// Enhanced validation schemas with security considerations
export const securitySchemas = {
  // Email validation with length limits and format checking
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .min(5, 'Email address is too short')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),

  // Strong password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  // Name validation with XSS prevention
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

  // URL validation with security checks
  url: z.string()
    .url('Please enter a valid URL')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    }, 'URL must use HTTP or HTTPS protocol'),

  // Phone number validation
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long'),

  // Currency amount validation
  currency: z.number()
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least $0.01')
    .max(999999.99, 'Amount is too large'),

  // File validation for uploads
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return allowedTypes.includes(file.type);
    }, 'File type not allowed'),

  // Text content validation with XSS prevention
  textContent: z.string()
    .max(10000, 'Content is too long')
    .refine((content) => {
      // Check for potential XSS patterns
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
      ];
      return !xssPatterns.some(pattern => pattern.test(content));
    }, 'Content contains potentially unsafe elements'),
};

/**
 * Input sanitization utilities
 */
export class SecurityUtils {
  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(html: string): string {
    if (typeof window !== 'undefined') {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target'],
        ALLOW_DATA_ATTR: false,
      });
    }
    // Server-side fallback
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Sanitize plain text input
   */
  static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s\-.,!?@#$%&*()]/g, ''); // Remove potentially dangerous characters
  }

  /**
   * Validate and sanitize email
   */
  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Validate file upload
   */
  static validateFile(file: File, maxSizeMB: number = 10): boolean {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    return (
      file.size <= maxSizeMB * 1024 * 1024 &&
      allowedTypes.includes(file.type)
    );
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length >= 20;
  }

  /**
   * Check for potential SQL injection patterns
   */
  static hasSQLInjectionPattern(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
      /(--|\/\*|\*\/|;)/,
    ];
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for potential XSS patterns
   */
  static hasXSSPattern(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    ];
    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Rate limiting utility
   */
  static createRateLimiter(maxAttempts: number, windowMs: number) {
    const attempts = new Map<string, { count: number; resetTime: number }>();

    return {
      isAllowed: (key: string): boolean => {
        const now = Date.now();
        const attempt = attempts.get(key);

        if (!attempt || now > attempt.resetTime) {
          attempts.set(key, { count: 1, resetTime: now + windowMs });
          return true;
        }

        if (attempt.count >= maxAttempts) {
          return false;
        }

        attempt.count++;
        return true;
      },

      getRemainingAttempts: (key: string): number => {
        const attempt = attempts.get(key);
        if (!attempt) return maxAttempts;
        return Math.max(0, maxAttempts - attempt.count);
      },

      reset: (key: string): void => {
        attempts.delete(key);
      },
    };
  }
}

/**
 * Security headers configuration
 */
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
  ].join('; '),
};

/**
 * Enhanced form validation schemas
 */
export const enhancedFormSchemas = {
  // Login form with enhanced security
  login: z.object({
    email: securitySchemas.email,
    password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
  }).refine((data) => {
    // Additional security checks
    if (SecurityUtils.hasSQLInjectionPattern(data.email) || 
        SecurityUtils.hasXSSPattern(data.email)) {
      return false;
    }
    return true;
  }, {
    message: 'Invalid input detected',
    path: ['email'],
  }),

  // Signup form with comprehensive validation
  signup: z.object({
    email: securitySchemas.email,
    password: securitySchemas.password,
    firstName: securitySchemas.firstName,
    lastName: securitySchemas.lastName,
  }).refine((data) => {
    // Prevent common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', data.email.split('@')[0]];
    if (weakPasswords.includes(data.password.toLowerCase())) {
      return false;
    }
    return true;
  }, {
    message: 'Password is too weak',
    path: ['password'],
  }),

  // Job creation with content validation
  jobCreation: z.object({
    title: z.string()
      .min(10, 'Title must be at least 10 characters')
      .max(100, 'Title must be less than 100 characters')
      .refine((title) => !SecurityUtils.hasXSSPattern(title), 'Title contains invalid characters'),
    description: z.string()
      .min(50, 'Description must be at least 50 characters')
      .max(2000, 'Description must be less than 2000 characters')
      .refine((content) => {
        // Check for potential XSS patterns
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
        ];
        return !xssPatterns.some(pattern => pattern.test(content));
      }, 'Description contains potentially unsafe elements'),
    budget: securitySchemas.currency,
    category: z.string().min(1, 'Category is required'),
    deadline: z.date().refine(
      (date) => date > new Date(),
      'Deadline must be in the future'
    ),
  }),
};

/**
 * Security middleware for API routes
 */
export const securityMiddleware = {
  /**
   * Validate request headers
   */
  validateHeaders: (headers: Headers): boolean => {
    const requiredHeaders = ['content-type', 'user-agent'];
    return requiredHeaders.every(header => headers.has(header));
  },

  /**
   * Validate request origin
   */
  validateOrigin: (origin: string, allowedOrigins: string[]): boolean => {
    return allowedOrigins.includes(origin);
  },

  /**
   * Sanitize request body
   */
  sanitizeBody: (body: Record<string, unknown>): Record<string, unknown> => {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityUtils.sanitizeText(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  },
}; 