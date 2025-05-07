import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useScrollTheme } from "@/hooks/use-scroll-theme";
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
import ThemeDemo from "@/pages/theme-demo";
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
  // Initialize scroll-based animations
  const { checkAnimations } = useScrollAnimation({
    stagger: true,
    staggerDelay: 75,
    offset: 200 // Larger offset triggers animations sooner
  });
  
  // Initialize scroll-based theme changes
  const { scrollPercentage } = useScrollTheme({
    threshold: 40, // Switch theme earlier while scrolling
    useSections: false
  });
  
  // Re-check animations when route changes
  const [location] = useLocation();
  useEffect(() => {
    // Force all animations to be visible immediately after route change
    const applyAnimationsToAll = () => {
      // Apply fade in effect to all scroll animation elements
      const fadeElements = document.querySelectorAll('.scrolled-fade-in');
      for (let i = 0; i < fadeElements.length; i++) {
        fadeElements[i].classList.add('fade-in-visible');
      }
      
      // Handle staggered children
      const staggerContainers = document.querySelectorAll('.stagger-children');
      for (let i = 0; i < staggerContainers.length; i++) {
        const container = staggerContainers[i];
        container.classList.add('fade-in-visible');
        
        const children = container.querySelectorAll('*');
        for (let j = 0; j < children.length; j++) {
          const child = children[j];
          if (child instanceof HTMLElement) {
            const delay = j * 50;
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, delay);
          }
        }
      }
      
      // Handle other animation types
      const otherAnimElements = document.querySelectorAll(
        '.fade-from-left, .fade-from-right, .fade-in, .scale-in'
      );
      for (let i = 0; i < otherAnimElements.length; i++) {
        otherAnimElements[i].classList.add('fade-in-visible');
      }
    };
    
    // Apply animations after a short delay
    const timeout1 = setTimeout(applyAnimationsToAll, 300);
    const timeout2 = setTimeout(checkAnimations, 100); 
    const timeout3 = setTimeout(checkAnimations, 500);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [location, checkAnimations]);
  
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
