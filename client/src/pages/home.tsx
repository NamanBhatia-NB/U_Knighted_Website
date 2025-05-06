import Navbar from "@/components/Navbar";
import HeroSection from "@/components/ChessSections/HeroSection";
import AboutSection from "@/components/ChessSections/AboutSection";
import EventsSection from "@/components/ChessSections/EventsSection";
import MembersSection from "@/components/ChessSections/MembersSection";
import NewsSection from "@/components/ChessSections/NewsSection";
import JoinSection from "@/components/ChessSections/JoinSection";
import ContactSection from "@/components/ChessSections/ContactSection";
import Footer from "@/components/ChessSections/Footer";
import { useEffect } from "react";

export default function Home() {
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
      <main>
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <MembersSection />
        <NewsSection />
        <JoinSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
