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
      scrolled 
        ? "theme-aware-glass shadow-md backdrop-blur-md" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className=" flex items-center justify-center transition-all">
              <img src="/generated-icon.png" alt="Chess society logo" className="w-10 h-10 rounded-full" />
            </div>
            <span className="text-xl font-bold font-display text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">U-Knighted Chess Society</span>
          </Link>

          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-8">
              <Link href="/about">
                <span className="navigation-link text-gray-800 dark:text-gray-100 hover:text-accent dark:hover:text-accent transition-colors font-medium">About</span>
              </Link>
              <Link href="/events">
                <span className="navigation-link text-gray-800 dark:text-gray-100 hover:text-accent dark:hover:text-accent transition-colors font-medium">Events</span>
              </Link>
              <Link href="/members">
                <span className="navigation-link text-gray-800 dark:text-gray-100 hover:text-accent dark:hover:text-accent transition-colors font-medium">Members</span>
              </Link>
              <Link href="/news">
                <span className="navigation-link text-gray-800 dark:text-gray-100 hover:text-accent dark:hover:text-accent transition-colors font-medium">News</span>
              </Link>
              <Link href="/contact">
                <span className="navigation-link text-gray-800 dark:text-gray-100 hover:text-accent dark:hover:text-accent transition-colors font-medium">Contact</span>
              </Link>
              <ThemeToggle />
              <Link href="/join">
                <button 
                  className="bg-accent hover:bg-accent/90 active:bg-accent/80 text-white font-medium px-5 py-2 rounded-md transition-all shadow-sm hover:shadow-md"
                >
                  Join Us
                </button>
              </Link>
            </nav>
          )}

          {/* Mobile menu and theme toggle */}
          {isMobile && (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                type="button"
                className="text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors"
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
          <div 
            className={`${mobileMenuOpen ? 'block' : 'hidden'} 
              theme-aware-glass dark:bg-gray-900/95 rounded-lg mt-2 p-5 
              absolute w-[calc(100%-2rem)] left-0 right-0 mx-4
              shadow-lg border border-gray-200/20 dark:border-gray-700/30
              backdrop-blur-xl transition-all duration-200`}
          >
            <nav className="flex flex-col space-y-5">
              <Link href="/about">
                <span className="navigation-link text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent transition-colors block text-lg font-medium">About</span>
              </Link>
              <Link href="/events">
                <span className="navigation-link text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent transition-colors block text-lg font-medium">Events</span>
              </Link>
              <Link href="/members">
                <span className="navigation-link text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent transition-colors block text-lg font-medium">Members</span>
              </Link>
              <Link href="/news">
                <span className="navigation-link text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent transition-colors block text-lg font-medium">News</span>
              </Link>
              <Link href="/contact">
                <span className="navigation-link text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent transition-colors block text-lg font-medium">Contact</span>
              </Link>
              <div className="pt-2">
                <Link href="/join">
                  <button
                    className="bg-accent hover:bg-accent/90 active:bg-accent/80 text-white font-medium px-5 py-3 rounded-md transition-all shadow-sm hover:shadow-md w-full text-center text-lg"
                  >
                    Join Us
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
