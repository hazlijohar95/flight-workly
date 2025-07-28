import React from 'react';

interface ProfileBubbleSimpleProps {
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: string;
  color: string;
  opacity?: number;
  className?: string;
  isAvatar?: boolean;
  avatarUrl?: string;
}

export default function ProfileBubbleSimple({ 
  position, 
  size, 
  color, 
  opacity = 0.6,
  className = '',
  isAvatar = false,
  avatarUrl
}: ProfileBubbleSimpleProps): JSX.Element {
  const style = {
    position: 'absolute' as const,
    top: position.top,
    bottom: position.bottom,
    left: position.left,
    right: position.right,
    width: size,
    height: size,
    opacity,
  };

  if (isAvatar && avatarUrl) {
    return (
      <div 
        className={`rounded-full ${className} floating-avatar cursor-pointer transition-all duration-300 hover:scale-110`}
        style={style}
      >
        <div className="w-full h-full rounded-full border-2 border-white shadow-lg overflow-hidden">
          <img 
            src={avatarUrl} 
            alt="User avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-full ${color} ${className} floating-avatar cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg border-2 border-white`}
      style={style}
    />
  );
} 