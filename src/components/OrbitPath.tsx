
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';
// Removed unused import

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
        className={`dotted-path ${isLoaded ? 'opacity-50' : 'opacity-0'} transition-opacity duration-1000`}
        stroke="rgba(156, 163, 175, 0.4)"
        strokeWidth="2"
      />
      
      {/* Additional orbit paths for more network effect */}
      <path 
        d="M150,200 C250,50 450,0 550,100 S750,150 950,100 S1050,250 950,400 C850,550 650,600 450,500 S250,450 150,350 S100,250 150,200" 
        className={`dotted-path ${isLoaded ? 'opacity-30' : 'opacity-0'} transition-opacity duration-1000`}
        stroke="rgba(156, 163, 175, 0.3)"
        strokeWidth="1.5"
      />
      
      <path 
        d="M250,300 C350,150 550,100 650,200 S850,250 1050,200 S1150,350 1050,500 C950,650 750,700 550,600 S350,550 250,450 S200,350 250,300" 
        className={`dotted-path ${isLoaded ? 'opacity-40' : 'opacity-0'} transition-opacity duration-1000`}
        stroke="rgba(156, 163, 175, 0.35)"
        strokeWidth="1.8"
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
