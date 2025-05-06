
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { colors } from '../theme/colors';

interface OrbitPathProps {
  isLoaded: boolean;
}

const OrbitPath: React.FC<OrbitPathProps> = ({ isLoaded }) => {
  const isMobile = useIsMobile();
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full" 
      viewBox="0 0 1200 800" 
      preserveAspectRatio="none"
      style={{ transform: isMobile ? 'scale(0.8)' : 'none' }}
    >
      <path 
        d="M200,250 C300,100 500,50 600,150 S800,200 1000,150 S1100,300 1000,450 C900,600 700,650 500,550 S300,500 200,400 S150,300 200,250" 
        className={`dotted-path ${isLoaded ? 'opacity-70' : 'opacity-0'} transition-opacity duration-1000`}
        stroke={colors.transparent.black[40]}
      />
      
      {/* Path dots - responsive positioning */}
      <circle cx="400" cy="100" r="4" className="path-dot" />
      <circle cx="800" cy="150" r="4" className="path-dot" />
      <circle cx="1000" cy="350" r="4" className="path-dot" />
      <circle cx="600" cy="600" r="4" className="path-dot" />
      <circle cx="250" cy="350" r="4" className="path-dot" />
    </svg>
  );
};

export default OrbitPath;
