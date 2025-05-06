import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    const scrollFadeElements = document.querySelectorAll('.scrolled-fade-in');
    
    const checkScroll = () => {
      scrollFadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('fade-in-visible');
        }
      });
    };
    
    window.addEventListener('scroll', checkScroll);
    // Check on initial load
    checkScroll();
    
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);
}
