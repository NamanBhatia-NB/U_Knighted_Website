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
    } else {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    }
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      
      // Set CSS variable for scroll position - this affects CSS transitions
      document.documentElement.style.setProperty('--scroll-position', `${scrollPercentage}%`);
      
      // Don't actually change the theme class on scroll - just set the intensity
      document.documentElement.style.setProperty('--theme-intensity', `${scrollPercentage}%`);
      
      // Update CSS variables for background and foreground colors
      if (baseTheme === 'light') {
        // Transition from pure white to light gray when scrolling in light mode
        const lightBgIntensity = Math.min(15, scrollPercentage / 3);
        document.documentElement.style.setProperty(
          '--background-transition', 
          `hsl(220 20% ${100 - lightBgIntensity}%)`
        );
      } else {
        // Transition from navy to deeper blue-black in dark mode
        const darkBgIntensity = Math.min(15, scrollPercentage / 3);
        document.documentElement.style.setProperty(
          '--background-transition', 
          `hsl(224 71% ${4 + darkBgIntensity}%)`
        );
      }
    };
    
    // Run once to initialize
    setTimeout(handleScroll, 50);
    
    // Set up scroll listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
