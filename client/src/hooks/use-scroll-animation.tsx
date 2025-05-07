import * as React from "react";

interface ScrollAnimationOptions {
  // Offset from the bottom of the viewport to trigger animations (in pixels)
  offset?: number; 
  // Whether to reset animations when elements scroll out of view
  resetOnExit?: boolean;
  // Class to apply to elements when they become visible
  visibleClass?: string;
  // Selector for elements to animate
  selector?: string;
  // Whether to use a staggered animation for child elements
  stagger?: boolean;
  // Stagger delay in milliseconds
  staggerDelay?: number;
}

/**
 * Enhanced hook for scroll-based animations with more options and features
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    offset = 150,
    resetOnExit = false,
    visibleClass = 'fade-in-visible',
    selector = '.scrolled-fade-in',
    stagger = false,
    staggerDelay = 75
  } = options;
  
  // Track animation elements and their status
  const [elements, setElements] = React.useState<Element[]>([]);
  const [animatedElements, setAnimatedElements] = React.useState<Set<Element>>(new Set());
  
  // Function to check if an element is in the viewport
  const isInViewport = React.useCallback((element: Element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if element is in viewport with offset
    const isVisible = 
      rect.top < windowHeight - offset && 
      rect.bottom > 0 && 
      rect.left < window.innerWidth && 
      rect.right > 0;
      
    return isVisible;
  }, [offset]);
  
  // Function to handle scroll events and apply animations
  const checkScroll = React.useCallback(() => {
    // Create a copy for tracking new animations
    const newAnimatedElements = new Set(animatedElements);
    let staggerIndex = 0;
    
    elements.forEach(element => {
      const isVisible = isInViewport(element);
      const isAnimated = animatedElements.has(element);
      
      if (isVisible && !isAnimated) {
        // Apply staggered animation if enabled
        if (stagger) {
          setTimeout(() => {
            element.classList.add(visibleClass);
          }, staggerIndex * staggerDelay);
          staggerIndex++;
        } else {
          element.classList.add(visibleClass);
        }
        
        newAnimatedElements.add(element);
      } else if (!isVisible && isAnimated && resetOnExit) {
        element.classList.remove(visibleClass);
        newAnimatedElements.delete(element);
      }
    });
    
    // Update state if changes occurred
    if (newAnimatedElements.size !== animatedElements.size) {
      setAnimatedElements(newAnimatedElements);
    }
  }, [elements, animatedElements, isInViewport, resetOnExit, stagger, staggerDelay, visibleClass]);
  
  // Query elements on mount and window resize
  React.useEffect(() => {
    const queryElements = () => {
      const newElements = Array.from(document.querySelectorAll(selector));
      setElements(newElements);
    };
    
    // Initial query
    queryElements();
    
    // Re-query on resize in case layout changes
    window.addEventListener('resize', queryElements);
    return () => window.removeEventListener('resize', queryElements);
  }, [selector]);
  
  // Set up scroll listener
  React.useEffect(() => {
    if (elements.length === 0) return;
    
    // Check animations on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Initial check
    checkScroll();
    
    return () => window.removeEventListener('scroll', checkScroll);
  }, [elements, checkScroll]);
  
  // Return utility functions
  return {
    // Manually trigger animation check (useful after dynamic content loads)
    checkAnimations: checkScroll,
    // Get current animated elements
    animatedElements: Array.from(animatedElements),
    // Count of total animation elements
    totalElements: elements.length,
    // Count of currently animated elements
    animatedCount: animatedElements.size
  };
}
