import React from 'react';
import { Link } from 'wouter';
import { useTheme } from '@/components/ThemeProvider';
import { useScrollTheme } from '@/hooks/use-scroll-theme';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ThemeDemo() {
  const { theme, setTheme, scrollThemeTransition, setScrollThemeTransition } = useTheme();
  const { scrollPercentage, isScrolledPast } = useScrollTheme({
    threshold: 50,
    useSections: false
  });
  
  // Initialize animations
  useScrollAnimation({
    stagger: true,
    staggerDelay: 100
  });
  
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="py-20 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 relative">
              <div className="absolute inset-0 bg-primary rounded-full opacity-10 animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3h6v1l2 6h-3v3h3l-3 7v1H9v-1l-3-7h3v-3H6l2-6z" />
                  <path d="M9 9v6" />
                  <path d="M15 9v6" />
                </svg>
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold font-display mb-6 fade-in scrolled-fade-in">
            Chess Society <span className="text-primary">Theme Engine</span>
          </h1>
          
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-80">
            Scroll down to experience our website's adaptive theme system. As you navigate through the content,
            watch how the colors gracefully transition between light and dark modes based on your scrolling.
          </p>
          
          <div className="inline-flex p-2 bg-muted/30 backdrop-blur-sm rounded-lg mb-6">
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="min-w-[120px]"
                size="sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                Light Mode
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="min-w-[120px]"
                size="sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                Dark Mode
              </Button>
              <Button 
                variant={scrollThemeTransition ? 'secondary' : 'outline'}
                onClick={() => setScrollThemeTransition(!scrollThemeTransition)}
                className="min-w-[180px]"
                size="sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <path d="M8 18v4" />
                  <path d="M16 18v4" />
                  <rect width="16" height="12" x="4" y="6" rx="2" />
                </svg>
                {scrollThemeTransition ? 'Disable Scrolling Effect' : 'Enable Scrolling Effect'}
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/40 backdrop-blur p-5 rounded-lg border border-primary/5 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">CURRENT THEME</p>
                <p className="font-medium flex items-center">
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                  )}
                  <span className="capitalize">{theme} Mode</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">SCROLL TRANSITION</p>
                <p className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${scrollThemeTransition ? 'text-primary' : 'text-muted-foreground'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {scrollThemeTransition ? (
                      <path d="M5 3v16h16" />
                    ) : (
                      <path d="M3 3v18h18" />
                    )}
                  </svg>
                  {scrollThemeTransition ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">SCROLL POSITION</p>
                <p className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  {scrollPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">ANIMATION</p>
                <p className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                  {isScrolledPast(50) ? 'Active' : 'Ready'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Cards */}
      <section className="py-10 mb-20">
        <h2 className="text-3xl font-bold font-display text-center mb-10">
          Theme-Aware Chess Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="theme-card p-6 scrolled-fade-in">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 3a3 3 0 0 0-3 3v12h6a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-3Z" />
                <path d="M6 3a3 3 0 0 1 3 3v12H3a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h3Z" />
                <path d="M7.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                <path d="M16.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Adaptive Chess Board</h3>
            <p className="text-center">
              Our chess boards adapt to light and dark themes with smooth transitions, ensuring perfect visibility in any lighting condition.
            </p>
          </Card>
          
          <Card className="theme-card p-6 scrolled-fade-in">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Contextual Pieces</h3>
            <p className="text-center">
              Chess pieces display with enhanced contrast and subtle highlights depending on the current theme for optimal clarity.
            </p>
          </Card>
          
          <Card className="theme-card p-6 scrolled-fade-in">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Gesture Controls</h3>
            <p className="text-center">
              Our interactive elements respond to user gestures with theme-appropriate feedback and visual cues.
            </p>
          </Card>
        </div>
      </section>
      
      {/* Scroll Animation Demo */}
      <section className="py-10 mb-20">
        <h2 className="text-3xl font-bold font-display text-center mb-10">
          Chess-Themed Scroll Animations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="fade-from-left scrolled-fade-in bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Chess Opening Tactics</h3>
              <p>Master the art of chess openings with our comprehensive guides that reveal the strategic principles behind each move.</p>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Sicilian Defense</span>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Queen's Gambit</span>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Ruy Lopez</span>
              </div>
            </div>
            <div className="fade-from-right scrolled-fade-in bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Endgame Mastery</h3>
              <p>Develop precision in endgame strategy with position analysis and practical techniques for securing victory in the final stages.</p>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">King & Pawn</span>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Rook Endings</span>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Queen vs Rook</span>
              </div>
            </div>
            <div className="fade-in scrolled-fade-in bg-muted/50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Tactical Combinations</h3>
              <p>Sharpen your tactical vision with puzzles that teach you to spot winning combinations and tactical motifs.</p>
              <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Pins</span>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Forks</span>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Discovered Attacks</span>
              </div>
            </div>
          </div>
          <div className="stagger-children scrolled-fade-in bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Upcoming Tournament Schedule</h3>
            <p className="mb-4">Join our competitive events with players of all levels:</p>
            <div className="bg-background p-4 rounded-md mb-2 flex justify-between items-center">
              <span>Beginner's Blitz</span>
              <span className="text-sm text-muted-foreground">May 15, 2025</span>
            </div>
            <div className="bg-background p-4 rounded-md mb-2 flex justify-between items-center">
              <span>Intermediate Rapid Play</span>
              <span className="text-sm text-muted-foreground">June 2, 2025</span>
            </div>
            <div className="bg-background p-4 rounded-md mb-2 flex justify-between items-center">
              <span>Advanced Classical</span>
              <span className="text-sm text-muted-foreground">June 18, 2025</span>
            </div>
            <div className="bg-background p-4 rounded-md mb-2 flex justify-between items-center">
              <span>Grandmaster Showcase</span>
              <span className="text-sm text-muted-foreground">July 5, 2025</span>
            </div>
            <div className="bg-background p-4 rounded-md mb-2 flex justify-between items-center">
              <span>Annual Championship</span>
              <span className="text-sm text-muted-foreground">July 24, 2025</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Theme Transition Container */}
      <section className="py-10 mb-20">
        <h2 className="text-3xl font-bold font-display text-center mb-10">
          Theme Transition Container
        </h2>
        <div className="theme-transition-container p-10 rounded-lg mb-10">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Chess Society Theme</h3>
            <p className="mb-6">
              This container showcases our chess society's theme colors that transition smoothly 
              between light and dark modes. The design ensures optimal readability and aesthetics in both themes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="aspect-square bg-primary rounded-md flex items-center justify-center font-mono text-xs text-primary-foreground">primary</div>
              <div className="aspect-square bg-secondary rounded-md flex items-center justify-center font-mono text-xs text-secondary-foreground">secondary</div>
              <div className="aspect-square bg-accent rounded-md flex items-center justify-center font-mono text-xs text-accent-foreground">accent</div>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center font-mono text-xs text-muted-foreground">muted</div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button>Standard Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Large spacer to allow scrolling */}
      <div className="h-[100vh]" />
      
      {/* Final section */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto bg-muted/30 backdrop-blur-sm p-10 rounded-lg border border-primary/5">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="16" height="16" x="4" y="4" rx="2" />
                <path d="M4 11h16" />
                <path d="M11 4v16" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold font-display mb-6">
            Theme Demo Complete
          </h2>
          
          <p className="text-xl mb-8 max-w-xl mx-auto">
            We've reached the end of our theme demonstration. The chess society website
            features this adaptive theme system throughout all pages.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="min-w-[140px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6" />
              </svg>
              Back to Top
            </Button>
            
            <Button variant="outline" asChild className="min-w-[140px]">
              <Link href="/">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home Page
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted-foreground/10 text-sm text-muted-foreground">
            <p>Chess Society © 2025 • Created with React, Tailwind & Three.js</p>
          </div>
        </div>
      </section>
    </div>
  );
}