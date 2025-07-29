import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SecurityUtils, securityHeaders } from '@/utils/security';
import { logInfo, logWarn, logError } from '@/utils/logger';

interface SecurityContextType {
  csrfToken: string;
  validateInput: (input: string, type: 'email' | 'text' | 'url') => boolean;
  sanitizeInput: (input: string, type: 'html' | 'text') => string;
  checkSecurityHeaders: () => void;
  isSecure: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps): JSX.Element {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isSecure, setIsSecure] = useState<boolean>(true);

  useEffect(() => {
    // Generate CSRF token on mount
    const token = SecurityUtils.generateCSRFToken();
    setCsrfToken(token);
    
    // Store token in session storage
    sessionStorage.setItem('csrf_token', token);
    
    logInfo('Security provider initialized', 'SecurityProvider');
  }, []);

  useEffect(() => {
    // Check for security headers
    checkSecurityHeaders();
    
    // Monitor for potential security issues
    const securityCheck = setInterval(() => {
      checkSecurityHeaders();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(securityCheck);
  }, []);

  const validateInput = (input: string, type: 'email' | 'text' | 'url'): boolean => {
    try {
      switch (type) {
        case 'email':
          return !SecurityUtils.hasXSSPattern(input) && 
                 !SecurityUtils.hasSQLInjectionPattern(input) &&
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        
        case 'text':
          return !SecurityUtils.hasXSSPattern(input) && 
                 !SecurityUtils.hasSQLInjectionPattern(input);
        
        case 'url':
          try {
            new URL(input);
            return !SecurityUtils.hasXSSPattern(input);
          } catch {
            return false;
          }
        
        default:
          return false;
      }
    } catch (error) {
      logError('Input validation failed', 'SecurityProvider', { input, type, error });
      return false;
    }
  };

  const sanitizeInput = (input: string, type: 'html' | 'text'): string => {
    try {
      switch (type) {
        case 'html':
          return SecurityUtils.sanitizeHtml(input);
        
        case 'text':
          return SecurityUtils.sanitizeText(input);
        
        default:
          return input;
      }
    } catch (error) {
      logError('Input sanitization failed', 'SecurityProvider', { input, type, error });
      return '';
    }
  };

  const checkSecurityHeaders = (): void => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') return;

      // Check for HTTPS
      const isHttps = window.location.protocol === 'https:';
      
      // Check for security headers (basic check)
      const hasSecurityHeaders = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
      
      // Check for secure context
      const isSecureContext = window.isSecureContext;
      
      const securityStatus = {
        https: isHttps,
        securityHeaders: hasSecurityHeaders,
        secureContext: isSecureContext,
      };

      const allSecure = Object.values(securityStatus).every(Boolean);
      setIsSecure(allSecure);

      if (!allSecure) {
        logWarn('Security issues detected', 'SecurityProvider', securityStatus);
      } else {
        logInfo('Security check passed', 'SecurityProvider', securityStatus);
      }
    } catch (error) {
      logError('Security header check failed', 'SecurityProvider', { error });
      setIsSecure(false);
    }
  };

  const value: SecurityContextType = {
    csrfToken,
    validateInput,
    sanitizeInput,
    checkSecurityHeaders,
    isSecure,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity(): SecurityContextType {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}

/**
 * Security middleware component for forms
 */
interface SecurityFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function SecureForm({ children, onSubmit, className }: SecurityFormProps): JSX.Element {
  const { csrfToken, validateInput } = useSecurity();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Validate CSRF token
    const formData = new FormData(e.target as HTMLFormElement);
    const formToken = formData.get('csrf_token') as string;
    
    if (!SecurityUtils.validateCSRFToken(formToken, csrfToken)) {
      logError('CSRF token validation failed', 'SecureForm');
      return;
    }

    // Validate all text inputs
    const inputs = (e.target as HTMLFormElement).querySelectorAll('input[type="text"], input[type="email"], textarea');
    let isValid = true;

    inputs.forEach((input) => {
      const inputElement = input as HTMLInputElement;
      const value = inputElement.value;
      const type = inputElement.type === 'email' ? 'email' : 'text';
      
      if (!validateInput(value, type)) {
        isValid = false;
        logWarn('Invalid input detected', 'SecureForm', { input: inputElement.name, value });
      }
    });

    if (!isValid) {
      logError('Form validation failed', 'SecureForm');
      return;
    }

    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      {children}
    </form>
  );
}

/**
 * Secure input component with built-in validation
 */
interface SecureInputProps {
  type: 'text' | 'email' | 'url';
  name: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  onChange?: (value: string, isValid: boolean) => void;
}

export function SecureInput({ 
  type, 
  name, 
  placeholder, 
  required = false, 
  className = '',
  onChange 
}: SecureInputProps): JSX.Element {
  const { validateInput, sanitizeInput } = useSecurity();
  const [value, setValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    const sanitizedValue = sanitizeInput(inputValue, 'text');
    const valid = validateInput(sanitizedValue, type);
    
    setValue(sanitizedValue);
    setIsValid(valid);
    
    if (onChange) {
      onChange(sanitizedValue, valid);
    }
  };

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={`${className} ${!isValid ? 'border-red-500' : ''}`}
      />
      {!isValid && (
        <div className="text-red-500 text-sm mt-1">
          Invalid {type} format
        </div>
      )}
    </div>
  );
} 