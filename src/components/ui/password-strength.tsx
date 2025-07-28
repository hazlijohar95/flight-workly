import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthCriteria {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const [criteria, setCriteria] = useState<StrengthCriteria[]>([
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8, met: false },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd), met: false },
    { label: 'Contains number', test: (pwd) => /\d/.test(pwd), met: false },
    { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), met: false },
  ]);

  useEffect(() => {
    setCriteria(prev => prev.map(criterion => ({
      ...criterion,
      met: criterion.test(password)
    })));
  }, [password]);

  const metCount = criteria.filter(c => c.met).length;
  const strengthPercentage = (metCount / criteria.length) * 100;

  const getStrengthColor = (): string => {
    if (strengthPercentage <= 20) {
      return 'bg-red-500';
    }
    if (strengthPercentage <= 40) {
      return 'bg-orange-500';
    }
    if (strengthPercentage <= 60) {
      return 'bg-yellow-500';
    }
    if (strengthPercentage <= 80) {
      return 'bg-blue-500';
    }
    return 'bg-green-500';
  };

  const getStrengthText = (): string => {
    if (strengthPercentage <= 20) {
      return 'Very Weak';
    }
    if (strengthPercentage <= 40) {
      return 'Weak';
    }
    if (strengthPercentage <= 60) {
      return 'Fair';
    }
    if (strengthPercentage <= 80) {
      return 'Good';
    }
    return 'Strong';
  };

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Password strength</span>
          <span className={getStrengthColor().replace('bg-', 'text-')}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Criteria list */}
      <div className="space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center text-xs">
            {criterion.met ? (
              <Check className="h-3 w-3 text-green-500 mr-2" />
            ) : (
              <X className="h-3 w-3 text-red-500 mr-2" />
            )}
            <span className={criterion.met ? 'text-green-700' : 'text-red-700'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 