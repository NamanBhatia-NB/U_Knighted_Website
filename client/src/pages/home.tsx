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
  // Add all fade-in-visible classes immediately to prevent blank spaces
  useEffect(() => {
    const scrollFadeElements = document.querySelectorAll('.scrolled-fade-in');
    scrollFadeElements.forEach(element => {
      element.classList.add('fade-in-visible');
    });
  }, []);

  return (
    <>
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
