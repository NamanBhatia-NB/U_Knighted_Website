import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? "theme-aware-glass" : ""
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-primary/5">
              <img src="/generated-icon.png" alt="" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold font-display text-primary dark:text-primary-foreground transition-colors">U-Knighted Chess Society</span>
          </Link>

          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-8">
              <Link href="/about" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">About</Link>
              <Link href="/events" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">Events</Link>
              <Link href="/members" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">Members</Link>
              <Link href="/news" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">News</Link>
              <Link href="/contact" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">Contact</Link>
              <ThemeToggle />
              <Link 
                href="/join" 
                className="bg-accent hover:bg-accent/80 text-accent-foreground px-4 py-2 rounded-md transition-colors shadow-sm"
              >
                Join Us
              </Link>
            </nav>
          )}

          {/* Mobile menu and theme toggle */}
          {isMobile && (
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                type="button"
                className="text-primary dark:text-primary-foreground hover:text-accent focus:outline-none p-1 rounded-md"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        {isMobile && (
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} theme-aware-glass rounded-lg mt-2 p-4 absolute w-full left-0 right-0 shadow-lg`}>
            <nav className="flex flex-col space-y-4">
              <Link href="/about" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">About</Link>
              <Link href="/events" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">Events</Link>
              <Link href="/members" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">Members</Link>
              <Link href="/news" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">News</Link>
              <Link href="/contact" className="text-primary dark:text-primary-foreground hover:text-accent transition-colors">Contact</Link>
              <Link 
                href="/join" 
                className="bg-accent hover:bg-accent/80 text-accent-foreground px-4 py-2 rounded-md transition-colors shadow-sm text-center"
              >
                Join Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
