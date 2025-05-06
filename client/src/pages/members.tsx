import Navbar from "@/components/Navbar";
import MembersSection from "@/components/ChessSections/MembersSection";
import Footer from "@/components/ChessSections/Footer";
import { useEffect } from "react";

export default function Members() {
  // Initialize scroll animation
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

  return (
    <>
      <Navbar />
      <div className="pt-24">
        <MembersSection />
      </div>
      <Footer />
    </>
  );
}
