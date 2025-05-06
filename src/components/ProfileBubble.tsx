
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { colors } from '../theme/colors';
import { animationClasses } from '../utils/animations';

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
  skill?: string;
  id?: string;
}

const ProfileBubble: React.FC<ProfileBubbleProps> = ({ 
  image, 
  message, 
  position, 
  size = "md",
  isBlurred = false,
  messageColor = "blue",
  delay = 0,
  skill,
  id
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-24 h-24",
    lg: "w-28 h-28"
  };
  
  const messageColorClasses = {
    blue: `bg-[${colors.message.blue}] text-white`,
    yellow: `bg-[${colors.message.yellow}] text-gray-800`,
    pink: `bg-[${colors.message.pink}] text-white`,
    green: `bg-[${colors.message.green}] text-white`
  };

  const blurClasses = isBlurred 
    ? "opacity-40 filter blur-sm z-0" 
    : "z-10 hover:scale-105 transition-transform duration-300";

  const animationDelay = `${delay}ms`;
  
  const handleImageError = () => {
    console.error(`Failed to load image: ${image}`);
    setImageError(true);
  };

  return (
    <div 
      className={`absolute ${animationClasses.fadeIn} ${blurClasses}`}
      style={{
        ...position as React.CSSProperties,
        animationDelay
      }}
      data-testid={`profile-bubble-${id}`}
    >
      <div className="relative group">
        {skill && !isBlurred ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {!imageError ? (
                <img 
                  src={image} 
                  alt={skill} 
                  className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md transition-all duration-300 hover:shadow-lg ${animationClasses.float}`}
                  onError={handleImageError}
                />
              ) : (
                <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-md ${animationClasses.float}`}>
                  <AvatarFallback className="bg-gray-300 text-gray-600">
                    {size === "sm" ? "?" : "User"}
                  </AvatarFallback>
                </Avatar>
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-black/80 text-white border-none py-1 px-2">
              {skill}
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            {!imageError ? (
              <img 
                src={image} 
                alt="Profile" 
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md ${isBlurred ? "filter blur-sm" : ""} transition-all duration-300 hover:shadow-lg ${animationClasses.float}`}
                onError={handleImageError}
              />
            ) : (
              <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-md ${animationClasses.float}`}>
                <AvatarFallback className="bg-gray-300 text-gray-600">
                  {size === "sm" ? "?" : "User"}
                </AvatarFallback>
              </Avatar>
            )}
          </>
        )}
        
        {message && !isBlurred && (
          <div className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${messageColorClasses[messageColor]} shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBubble;
