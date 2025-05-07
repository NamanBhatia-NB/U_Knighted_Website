import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMobile();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "glass" : ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/generated-icon.png" alt="" />
            </div>
            <span className="text-xl font-bold font-display">U-Knighted Chess Society</span>
          </Link>

          {/* Mobile menu button */}
          {isMobile && (
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-8">
              <Link href="/about" className="text-primary hover:text-accent transition-colors">About</Link>
              <Link href="/events" className="text-primary hover:text-accent transition-colors">Events</Link>
              <Link href="/members" className="text-primary hover:text-accent transition-colors">Members</Link>
              <Link href="/news" className="text-primary hover:text-accent transition-colors">News</Link>
              <Link href="/contact" className="text-primary hover:text-accent transition-colors">Contact</Link>
              <Link href="/join" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition-colors">Join Us</Link>
            </nav>
          )}
        </div>

        {/* Mobile navigation */}
        {isMobile && (
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} glass rounded-lg mt-2 p-4 absolute w-full left-0 right-0`}>
            <nav className="flex flex-col space-y-4">
              <Link href="/about" className="text-primary hover:text-accent transition-colors">About</Link>
              <Link href="/events" className="text-primary hover:text-accent transition-colors">Events</Link>
              <Link href="/members" className="text-primary hover:text-accent transition-colors">Members</Link>
              <Link href="/news" className="text-primary hover:text-accent transition-colors">News</Link>
              <Link href="/contact" className="text-primary hover:text-accent transition-colors">Contact</Link>
              <Link href="/join" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent text-center hover:text-primary transition-colors">Join Us</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
