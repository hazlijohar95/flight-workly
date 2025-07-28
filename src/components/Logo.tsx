
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  showTagline?: boolean;
  className?: string;
  linkTo?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  showTagline = false, 
  className = '', 
  linkTo = '/',
  size = 'md',
  variant = 'dark'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <div className={`flex items-center group ${className}`}>
      <div className="flex flex-col">
        <h3 className={`font-light ${sizeClasses[size]} ${variant === 'light' ? 'text-white group-hover:text-gray-200 drop-shadow-lg' : 'text-gray-700 group-hover:text-gray-900'} transition-all duration-200 tracking-wide`}>
          FLIGHTWORKLY
        </h3>
        {showTagline && (
          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200 -mt-0.5 font-light">
            Fast Freelance Hiring
          </p>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
