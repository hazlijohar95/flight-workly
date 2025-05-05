
import React from 'react';

interface ProfileBubbleProps {
  image: string;
  message?: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size?: "sm" | "md" | "lg";
  isBlurred?: boolean;
  messageColor?: "blue" | "yellow" | "pink" | "green";
  delay?: number;
}

const ProfileBubble: React.FC<ProfileBubbleProps> = ({ 
  image, 
  message, 
  position, 
  size = "md",
  isBlurred = false,
  messageColor = "blue",
  delay = 0
}) => {
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-24 h-24",
    lg: "w-28 h-28"
  };
  
  const messageColorClasses = {
    blue: "bg-[#33C3F0] text-white",
    yellow: "bg-[#FFC107] text-gray-800",
    pink: "bg-[#FF4081] text-white",
    green: "bg-[#4CAF50] text-white"
  };

  const animationDelay = `${delay}ms`;

  return (
    <div 
      className={`absolute animate-fade-in hover:scale-105 transition-transform duration-300`}
      style={{
        ...position as React.CSSProperties,
        animationDelay
      }}
    >
      <div className="relative group">
        <img 
          src={image} 
          alt="Profile" 
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md ${isBlurred ? "filter blur-sm" : ""} transition-all duration-300 hover:shadow-lg animate-float`} 
        />
        
        {message && (
          <div className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${messageColorClasses[messageColor]} shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBubble;
