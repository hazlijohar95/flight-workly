
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
}

const ProfileBubble: React.FC<ProfileBubbleProps> = ({ 
  image, 
  message, 
  position, 
  size = "md",
  isBlurred = false
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className="absolute" style={position as React.CSSProperties}>
      <div className="relative">
        <img 
          src={image} 
          alt="Profile" 
          className={`profile-img ${sizeClasses[size]} ${isBlurred ? "filter blur-sm" : ""}`} 
        />
        
        {message && (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 highlight-bubble">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBubble;
