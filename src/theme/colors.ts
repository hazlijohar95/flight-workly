
// Theme color constants for the application
export const colors = {
  // Brand colors
  primary: {
    pink: '#FF4081',
    dark: '#121212',
  },
  // UI colors
  ui: {
    white: '#FFFFFF',
    lightGray: '#F6F6F7',
    gray: {
      100: '#F1F0FB',
      300: '#C8C8C9',
      500: '#8E9196',
      600: '#75869600',
      800: '#403E43',
    },
  },
  // Message bubble colors
  message: {
    blue: '#33C3F0',
    yellow: '#FFC107',
    pink: '#FF4081',
    green: '#4CAF50',
  },
  // Utility
  transparent: {
    white: {
      30: 'rgba(255, 255, 255, 0.3)',
      40: 'rgba(255, 255, 255, 0.4)',
      90: 'rgba(255, 255, 255, 0.9)',
    },
    black: {
      40: 'rgba(0, 0, 0, 0.4)',
    },
  },
};

// Common style combinations to avoid repetition
export const stylePresets = {
  glassBg: 'bg-white/40 backdrop-blur-sm border border-white/30',
  cardShadow: 'shadow-md hover:shadow-lg transition-shadow duration-300',
};
