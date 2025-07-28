
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileBubbleProps {
  id: string;
  image: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: "sm" | "md" | "lg";
  message?: string;
  messageColor?: "blue" | "yellow" | "pink" | "green";
  delay?: number;
  skill?: string;
  isBlurred?: boolean;
}

export default function ProfileBubble({
  id: _id,
  image,
  position,
  size,
  message,
  messageColor = "blue",
  delay: _delay = 0,
  skill,
  isBlurred = false
}: ProfileBubbleProps): JSX.Element {
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-24 h-24", 
    lg: "w-28 h-28"
  };

  const messageColorClasses = {
    blue: "bg-blue-500 text-white",
    yellow: "bg-yellow-400 text-gray-800",
    pink: "bg-pink-500 text-white",
    green: "bg-green-500 text-white"
  };

  const handleBubbleClick = (): void => {
    // Handle bubble click - could be used for navigation or modal
  };

  return (
    <div
      className={`absolute ${isBlurred ? 'blur-sm opacity-50' : ''} transition-all duration-300 hover:scale-105`}
      style={position}
      onClick={handleBubbleClick}
    >
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} cursor-pointer border-2 border-white shadow-lg`}>
          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
            {image ? image.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        {message && (
          <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs shadow-lg ${messageColorClasses[messageColor]}`}>
            {message}
          </div>
        )}
        
        {skill && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            {skill}
          </div>
        )}
      </div>
    </div>
  );
}
