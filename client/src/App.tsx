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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      
      // Set CSS variable for scroll position
      document.documentElement.style.setProperty('--scroll-position', `${scrollPercentage}%`);
      
      // Apply theme based on scroll percentage
      if (scrollPercentage > 40) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
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
