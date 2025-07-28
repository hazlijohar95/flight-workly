import { z } from 'zod';
import { ValidationError } from './error-handler';

/**
 * Common validation schemas
 */
export const validationSchemas = {
  // Email validation
  email: z.string().email('Please enter a valid email address'),

  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  // Name validation
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

  // Phone number validation
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number'),

  // URL validation
  url: z.string().url('Please enter a valid URL'),

  // Currency amount validation
  currency: z.number()
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least $0.01'),

  // Date validation
  futureDate: z.date().refine(
    (date) => date > new Date(),
    'Date must be in the future'
  ),

  // File validation
  imageFile: z.instanceof(File).refine(
    (file) => file.type.startsWith('image/'),
    'File must be an image'
  ).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    'Image size must be less than 5MB'
  ),
};

/**
 * Form validation schemas
 */
export const formSchemas = {
  // Login form
  login: z.object({
    email: validationSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),

  // Signup form
  signup: z.object({
    email: validationSchemas.email,
    password: validationSchemas.password,
    firstName: validationSchemas.firstName,
    lastName: validationSchemas.lastName,
  }).refine(
    (data) => data.password !== data.email,
    {
      message: 'Password cannot be the same as email',
      path: ['password'],
    }
  ),

  // Profile update form
  profileUpdate: z.object({
    firstName: validationSchemas.firstName.optional(),
    lastName: validationSchemas.lastName.optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    avatar_url: validationSchemas.url.optional(),
  }),

  // Job creation form
  jobCreation: z.object({
    title: z.string()
      .min(10, 'Title must be at least 10 characters')
      .max(100, 'Title must be less than 100 characters'),
    description: z.string()
      .min(50, 'Description must be at least 50 characters')
      .max(2000, 'Description must be less than 2000 characters'),
    budget: validationSchemas.currency,
    category: z.string().min(1, 'Category is required'),
    deadline: validationSchemas.futureDate,
    uses_milestones: z.boolean().optional(),
  }),

  // Bid submission form
  bidSubmission: z.object({
    fee: validationSchemas.currency,
    time_estimate: z.number()
      .positive('Time estimate must be positive')
      .min(1, 'Time estimate must be at least 1 day'),
    portfolio_url: validationSchemas.url.optional(),
    note: z.string()
      .min(10, 'Note must be at least 10 characters')
      .max(1000, 'Note must be less than 1000 characters'),
  }),
};

/**
 * Validation utility functions
 */
export class ValidationUtils {
  /**
   * Validate a value against a schema
   */
  static validate<T>(schema: z.ZodSchema<T>, value: unknown): T {
    try {
      return schema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.errors[0]?.message || 'Validation failed');
      }
      throw error;
    }
  }

  /**
   * Validate a value against a schema safely (returns null on error)
   */
  static validateSafe<T>(schema: z.ZodSchema<T>, value: unknown): T | null {
    try {
      return schema.parse(value);
    } catch {
      return null;
    }
  }

  /**
   * Check if a value is a valid email
   */
  static isValidEmail(email: string): boolean {
    return validationSchemas.email.safeParse(email).success;
  }

  /**
   * Check if a value is a valid URL
   */
  static isValidUrl(url: string): boolean {
    return validationSchemas.url.safeParse(url).success;
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Validate file size
   */
  static validateFileSize(file: File, maxSizeMB: number): boolean {
    return file.size <= maxSizeMB * 1024 * 1024;
  }

  /**
   * Validate file type
   */
  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }
}

// Export types
export type LoginFormData = z.infer<typeof formSchemas.login>;
export type SignupFormData = z.infer<typeof formSchemas.signup>;
export type ProfileUpdateData = z.infer<typeof formSchemas.profileUpdate>;
export type JobCreationData = z.infer<typeof formSchemas.jobCreation>;
export type BidSubmissionData = z.infer<typeof formSchemas.bidSubmission>; 