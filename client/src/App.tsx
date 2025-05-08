import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Events from "@/pages/events";
import EventDetail from "@/pages/event-detail";
import Members from "@/pages/members";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import Contact from "@/pages/contact";
import Join from "@/pages/join";

import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/events" component={Events} />
          <Route path="/event/:id" component={EventDetail} />
          <Route path="/members" component={Members} />
          <Route path="/news" component={News} />
          <Route path="/news/:id" component={NewsDetail} />
          <Route path="/contact" component={Contact} />
          <Route path="/join" component={Join} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function ScrollAnimationWrapper() {
  // Re-check animations when route changes
  const [location] = useLocation();
  
  // Apply animations immediately and then on scroll
  useEffect(() => {
    const applyAllAnimations = () => {
      // Force all animations visible
      document.querySelectorAll('.scrolled-fade-in, .fade-from-left, .fade-from-right, .fade-in, .scale-in')
        .forEach(element => element.classList.add('fade-in-visible'));
      
      // Handle staggered children
      document.querySelectorAll('.stagger-children').forEach((container, index) => {
        container.classList.add('fade-in-visible');
        
        Array.from(container.children).forEach((child, childIndex) => {
          if (child instanceof HTMLElement) {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, childIndex * 50);
          }
        });
      });
    };
    
    // Run immediately and then on scroll events
    applyAllAnimations();
    
    // Ensure animation elements are always visible after any scroll
    const scrollHandler = () => {
      applyAllAnimations();
    };
    
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [location]);
  
  // Handle theme changes based on scroll position
  useEffect(() => {
    // Store the original theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'system';
    let baseTheme = savedTheme;
    
    // If system, resolve to actual light/dark
    if (baseTheme === 'system') {
      baseTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Set initial classes based on the theme
    if (baseTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.setProperty('--initial-background', 'hsl(224 71% 4%)');
    } else {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
      document.documentElement.style.setProperty('--initial-background', 'hsl(0 0% 100%)');
    }
    
    // Cache these values outside the scroll handler for performance
    const docElement = document.documentElement;
    const body = document.body;
    const maxScrollIntensity = 25; // Maximum intensity value for scroll effect
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = body.scrollHeight - viewportHeight;
      
      // Ensure we don't divide by zero if page is not scrollable
      if (docHeight <= 0) return;
      
      // Calculate scroll percentage (0-100)
      const scrollPercentage = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      
      // Set CSS variable for scroll position - this affects CSS transitions
      docElement.style.setProperty('--scroll-position', `${scrollPercentage}%`);
      
      // Don't actually change the theme class on scroll - just set the intensity
      docElement.style.setProperty('--theme-intensity', `${scrollPercentage}%`);
      
      // Calculate eased intensity for a smoother feel
      // Using easeOutQuad function for smoother transitions: t*(2-t)
      const easing = scrollPercentage / 100;
      const easedIntensity = easing * (2 - easing);
      const intensity = Math.min(maxScrollIntensity, easedIntensity * maxScrollIntensity);
      
      // Update CSS variables for background and foreground colors with easing
      if (baseTheme === 'light') {
        // Transition from pure white to light gray/blue when scrolling in light mode
        const hue = 210 + (intensity * 0.4); // Subtle hue shift as you scroll
        const saturation = 10 + (intensity * 0.5); 
        const lightness = Math.max(85, 100 - (intensity * 0.6));
        
        docElement.style.setProperty(
          '--background-transition', 
          `hsl(${hue} ${saturation}% ${lightness}%)`
        );
      } else {
        // Transition from navy to deeper blue-black in dark mode with subtle color shift
        const hue = 224 + (intensity * 0.2); // Subtle hue shift
        const saturation = Math.max(50, 71 - (intensity * 0.8));
        const lightness = Math.min(12, 4 + (intensity * 0.3));
        
        docElement.style.setProperty(
          '--background-transition', 
          `hsl(${hue} ${saturation}% ${lightness}%)`
        );
      }
    };
    
    // Run once to initialize with a small delay to ensure the DOM is ready
    const initTimer = setTimeout(handleScroll, 50);
    
    // Implement throttling for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Set up scroll listener with throttling
    window.addEventListener('scroll', scrollListener, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', scrollListener);
      clearTimeout(initTimer);
    };
  }, []);
  
  return null;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <ScrollAnimationWrapper />
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
