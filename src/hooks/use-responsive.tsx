
import { useState, useEffect, useCallback, useMemo } from "react";

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  '2xl': 1400,
} as const;

interface ResponsiveState {
  breakpoint: Breakpoint;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isBreakpoint: (bp: Breakpoint) => boolean;
  isMinBreakpoint: (bp: Breakpoint) => boolean;
  isMaxBreakpoint: (bp: Breakpoint) => boolean;
}

/**
 * Custom hook for responsive design with optimized performance
 */
export function useResponsive(): ResponsiveState {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const updateSize = useCallback((): void => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // Set initial size
    updateSize();

    // Add event listener with throttling
    let timeoutId: NodeJS.Timeout;
    const handleResize = (): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSize, 100);
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [updateSize]);

  const breakpoint = useMemo((): Breakpoint => {
    const { width } = dimensions;
    
    if (width < BREAKPOINTS.sm) {return 'xs';}
    if (width < BREAKPOINTS.md) {return 'sm';}
    if (width < BREAKPOINTS.lg) {return 'md';}
    if (width < BREAKPOINTS.xl) {return 'lg';}
    if (width < BREAKPOINTS['2xl']) {return 'xl';}
    return '2xl';
  }, [dimensions.width]);

  const isBreakpoint = useCallback((bp: Breakpoint): boolean => {
    return breakpoint === bp;
  }, [breakpoint]);

  const isMinBreakpoint = useCallback((bp: Breakpoint): boolean => {
    const breakpointValues = Object.entries(BREAKPOINTS);
    const currentIndex = breakpointValues.findIndex(([key]) => key === breakpoint);
    const targetIndex = breakpointValues.findIndex(([key]) => key === bp);
    return currentIndex >= targetIndex;
  }, [breakpoint]);

  const isMaxBreakpoint = useCallback((bp: Breakpoint): boolean => {
    const breakpointValues = Object.entries(BREAKPOINTS);
    const currentIndex = breakpointValues.findIndex(([key]) => key === breakpoint);
    const targetIndex = breakpointValues.findIndex(([key]) => key === bp);
    return currentIndex <= targetIndex;
  }, [breakpoint]);

  const responsiveState = useMemo((): ResponsiveState => ({
    breakpoint,
    width: dimensions.width,
    height: dimensions.height,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
    isLargeDesktop: breakpoint === '2xl',
    isBreakpoint,
    isMinBreakpoint,
    isMaxBreakpoint,
  }), [breakpoint, dimensions.width, dimensions.height, isBreakpoint, isMinBreakpoint, isMaxBreakpoint]);

  return responsiveState;
}

/**
 * Hook for checking if a specific breakpoint is active
 */
export function useBreakpoint(targetBreakpoint: Breakpoint): boolean {
  const { isBreakpoint } = useResponsive();
  return isBreakpoint(targetBreakpoint);
}

/**
 * Hook for checking if screen is mobile
 */
export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

/**
 * Hook for checking if screen is desktop
 */
export function useIsDesktop(): boolean {
  const { isDesktop } = useResponsive();
  return isDesktop;
}
