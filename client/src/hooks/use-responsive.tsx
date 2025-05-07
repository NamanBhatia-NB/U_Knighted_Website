import * as React from "react";

// Standard breakpoints based on Tailwind CSS
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Hook that returns the current screen size and various responsive utilities
 */
export function useResponsive() {
  const [screenSize, setScreenSize] = React.useState<ScreenSize>('md');
  const [dimensions, setDimensions] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let size: ScreenSize = 'xs';
      
      if (width >= BREAKPOINTS['2xl']) size = '2xl';
      else if (width >= BREAKPOINTS.xl) size = 'xl';
      else if (width >= BREAKPOINTS.lg) size = 'lg';
      else if (width >= BREAKPOINTS.md) size = 'md';
      else if (width >= BREAKPOINTS.sm) size = 'sm';
      
      setScreenSize(size);
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial sizing
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    screenSize,
    width: dimensions.width,
    height: dimensions.height,
    isMobile: screenSize === 'xs' || screenSize === 'sm',
    isTablet: screenSize === 'md',
    isDesktop: screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl',
    isSmallScreen: screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md',
    isLargeScreen: screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl',
    isExtraLargeScreen: screenSize === 'xl' || screenSize === '2xl',
  };
}