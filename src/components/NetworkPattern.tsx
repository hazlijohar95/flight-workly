import React from 'react';

interface NetworkPatternProps {
  className?: string;
}

export default function NetworkPattern({ className = '' }: NetworkPatternProps): JSX.Element {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{ opacity: 0.1 }}
      >
        <defs>
          <pattern 
            id="network-pattern" 
            x="0" 
            y="0" 
            width="10" 
            height="10" 
            patternUnits="userSpaceOnUse"
          >
            {/* Dots */}
            <circle cx="5" cy="5" r="0.5" fill="#FF4081" opacity="0.6"/>
            <circle cx="15" cy="5" r="0.5" fill="#FF4081" opacity="0.4"/>
            <circle cx="5" cy="15" r="0.5" fill="#FF4081" opacity="0.4"/>
            <circle cx="15" cy="15" r="0.5" fill="#FF4081" opacity="0.6"/>
            
            {/* Horizontal lines */}
            <line 
              x1="0" 
              y1="5" 
              x2="20" 
              y2="5" 
              stroke="#FF4081" 
              strokeWidth="0.2" 
              opacity="0.3" 
              strokeDasharray="1,1"
            />
            <line 
              x1="0" 
              y1="15" 
              x2="20" 
              y2="15" 
              stroke="#FF4081" 
              strokeWidth="0.2" 
              opacity="0.3" 
              strokeDasharray="1,1"
            />
            
            {/* Vertical lines */}
            <line 
              x1="5" 
              y1="0" 
              x2="5" 
              y2="20" 
              stroke="#FF4081" 
              strokeWidth="0.2" 
              opacity="0.3" 
              strokeDasharray="1,1"
            />
            <line 
              x1="15" 
              y1="0" 
              x2="15" 
              y2="20" 
              stroke="#FF4081" 
              strokeWidth="0.2" 
              opacity="0.3" 
              strokeDasharray="1,1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#network-pattern)"/>
      </svg>
    </div>
  );
} 