
import { CSSProperties } from 'react';

// Animation delay utility - generates a CSS delay style
export const useAnimationDelay = (delayMs: number): CSSProperties => {
  return { animationDelay: `${delayMs}ms` };
};

// Animation class utility - combines multiple animation classes
export const combineAnimationClasses = (
  baseClasses: string,
  conditionalClasses?: { [key: string]: boolean }
): string => {
  if (!conditionalClasses) {return baseClasses;}
  
  const activeClasses = Object.entries(conditionalClasses)
    .filter(([_, isActive]) => isActive)
    .map(([className]) => className);
    
  return [baseClasses, ...activeClasses].filter(Boolean).join(' ');
};

// Predefined animation classes for common use cases
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  float: 'animate-float',
  scale: 'transition-transform duration-300 hover:scale-105',
  highlight: 'transition-all duration-300 hover:shadow-md',
};
