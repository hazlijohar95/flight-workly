
import * as React from "react";

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};

export function useResponsive() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>('md');
  const [width, setWidth] = React.useState<number>(0);
  
  React.useEffect(() => {
    const updateSize = () => {
      const windowWidth = window.innerWidth;
      setWidth(windowWidth);
      
      if (windowWidth < BREAKPOINTS.sm) {
        setBreakpoint('xs');
      } else if (windowWidth < BREAKPOINTS.md) {
        setBreakpoint('sm');
      } else if (windowWidth < BREAKPOINTS.lg) {
        setBreakpoint('md');
      } else if (windowWidth < BREAKPOINTS.xl) {
        setBreakpoint('lg');
      } else {
        setBreakpoint('xl');
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize(); // Initial call
    
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return {
    breakpoint,
    width,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
    isBreakpoint: (bp: Breakpoint) => breakpoint === bp,
    isMinBreakpoint: (bp: Breakpoint) => {
      const breakpointValues = Object.entries(BREAKPOINTS);
      const currentIndex = breakpointValues.findIndex(([key]) => key === breakpoint);
      const targetIndex = breakpointValues.findIndex(([key]) => key === bp);
      return currentIndex >= targetIndex;
    },
    isMaxBreakpoint: (bp: Breakpoint) => {
      const breakpointValues = Object.entries(BREAKPOINTS);
      const currentIndex = breakpointValues.findIndex(([key]) => key === breakpoint);
      const targetIndex = breakpointValues.findIndex(([key]) => key === bp);
      return currentIndex <= targetIndex;
    }
  };
}
