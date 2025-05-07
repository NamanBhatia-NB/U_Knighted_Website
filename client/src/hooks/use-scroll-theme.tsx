import * as React from "react";
import { useTheme } from "@/components/ThemeProvider";

interface ScrollThemeOptions {
  // Percentage of scroll at which theme changes (0-100)
  threshold?: number;
  // Whether to enable smooth transition effect
  smoothTransition?: boolean;
  // CSS variable name to update with scroll position
  scrollPositionVar?: string;
  // Whether to use sections for theme changes instead of continuous scrolling
  useSections?: boolean;
}

/**
 * Hook that manages theme changes based on scroll position
 */
export function useScrollTheme(options: ScrollThemeOptions = {}) {
  const {
    threshold = 50,
    smoothTransition = true,
    scrollPositionVar = '--scroll-position',
    useSections = false
  } = options;
  
  const { theme, setTheme, scrollThemeTransition } = useTheme();
  const [scrollPercentage, setScrollPercentage] = React.useState(0);
  const [themeBySection, setThemeBySection] = React.useState<Record<string, string>>({});
  
  // Function to calculate scroll percentage
  const calculateScrollPercentage = React.useCallback(() => {
    const scrollPosition = window.scrollY;
    const documentHeight = document.body.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? (scrollPosition / documentHeight) * 100 : 0;
  }, []);
  
  // Function to update theme based on scroll position
  const updateThemeByScroll = React.useCallback((percentage: number) => {
    const root = window.document.documentElement;
    
    // Update CSS variable for scroll position
    root.style.setProperty(scrollPositionVar, `${percentage}%`);
    
    // Handle theme changes based on threshold
    if (scrollThemeTransition) {
      // Force the appropriate theme based on scroll position
      if (percentage > threshold) {
        // Set dark theme directly on the root element for immediate effect
        root.classList.remove('light');
        root.classList.add('dark');
        
        // Update theme state in provider to maintain consistency
        if (theme !== 'dark') setTheme('dark');
        
        // Calculate transition factor (0-100%)
        const transitionFactor = Math.min(100, ((percentage - threshold) / (100 - threshold)) * 100);
        root.style.setProperty('--theme-transition-factor', `${transitionFactor}%`);
      } else {
        // Set light theme directly on the root element for immediate effect
        root.classList.remove('dark');
        root.classList.add('light');
        
        // Update theme state in provider to maintain consistency
        if (theme !== 'light') setTheme('light');
        
        // Calculate transition factor (100-0%)
        const transitionFactor = Math.max(0, 100 - (percentage / threshold) * 100);
        root.style.setProperty('--theme-transition-factor', `${transitionFactor}%`);
      }
    }
  }, [scrollThemeTransition, threshold, theme, setTheme, scrollPositionVar]);
  
  // Function to determine theme by visible sections
  const updateThemeBySections = React.useCallback(() => {
    if (!useSections || !scrollThemeTransition) return;
    
    // Query elements with the data-theme-section attribute
    const sections = document.querySelectorAll('[data-theme-section]');
    if (sections.length === 0) return;
    
    // Find the most visible section
    let mostVisibleSection: Element | null = null;
    let maxVisibility = 0;
    
    // Safely iterate through NodeList
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, rect.top < 0 ? 0 : rect.top);
      const visibleBottom = Math.min(windowHeight, rect.bottom);
      const visibleHeight = visibleBottom - visibleTop;
      const visibilityPercentage = (visibleHeight / windowHeight) * 100;
      
      if (visibilityPercentage > maxVisibility) {
        maxVisibility = visibilityPercentage;
        mostVisibleSection = section;
      }
    }
    
    // Update theme based on most visible section
    if (mostVisibleSection) {
      const sectionTheme = mostVisibleSection.getAttribute('data-theme-section');
      if (sectionTheme === 'light' || sectionTheme === 'dark') {
        if (theme !== sectionTheme) {
          setTheme(sectionTheme as 'light' | 'dark');
        }
      }
    }
  }, [useSections, scrollThemeTransition, theme, setTheme]);
  
  // Handle scroll events
  React.useEffect(() => {
    const handleScroll = () => {
      const percentage = calculateScrollPercentage();
      setScrollPercentage(percentage);
      
      if (useSections) {
        updateThemeBySections();
      } else {
        updateThemeByScroll(percentage);
      }
    };
    
    // Initialize
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [calculateScrollPercentage, updateThemeByScroll, updateThemeBySections, useSections]);
  
  // Return scroll information and control functions
  return {
    scrollPercentage,
    isScrolled: scrollPercentage > 0,
    isScrolledPast: (percent: number) => scrollPercentage > percent,
    themeBySection,
    // Helper function to mark a section with a specific theme
    setThemeSection: (id: string, theme: 'light' | 'dark') => {
      setThemeBySection(prev => ({ ...prev, [id]: theme }));
    }
  };
}