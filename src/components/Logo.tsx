
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  showTagline?: boolean;
  className?: string;
  linkTo?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  showTagline = false, 
  className = '', 
  linkTo = '/' 
}) => {
  const content = (
    <div className={`flex flex-col items-start ${className}`}>
      <h3 className="font-bold text-xl">
        <span className="font-normal">FLIGHT</span>WORKLY
      </h3>
      {showTagline && (
        <p className="text-xs text-gray-600 -mt-1">Fast Freelance Hiring</p>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
