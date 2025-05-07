import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  scrollThemeTransition: boolean;
  setScrollThemeTransition: (enabled: boolean) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  scrollThemeTransition: true,
  setScrollThemeTransition: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "chess-society-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || "system"
  );
  
  const [scrollThemeTransition, setScrollThemeTransition] = useState<boolean>(
    localStorage.getItem("scroll-theme-transition") !== "false" // Default to true
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const htmlEl = window.document.querySelector('html');
    const bodyEl = window.document.body;
    
    // Remove classes from all important elements
    root.classList.remove("light", "dark");
    htmlEl?.classList.remove("light", "dark");
    bodyEl?.classList.remove("light", "dark");
    
    let appliedTheme: Theme = theme;
    
    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    }
    
    // Apply the theme to all important elements
    root.classList.add(appliedTheme);
    htmlEl?.classList.add(appliedTheme);
    bodyEl?.classList.add(appliedTheme);
    
    // Force background colors via direct style for immediate effect
    if (appliedTheme === "dark") {
      root.style.backgroundColor = 'hsl(224 71% 4%)';
      htmlEl?.setAttribute('style', 'background-color: hsl(224 71% 4%) !important');
      bodyEl?.setAttribute('style', 'background-color: hsl(224 71% 4%) !important');
      document.querySelectorAll('main').forEach(el => {
        (el as HTMLElement).style.backgroundColor = 'hsl(224 71% 4%)';
      });
    } else {
      root.style.backgroundColor = 'hsl(0 0% 100%)';
      htmlEl?.setAttribute('style', 'background-color: hsl(0 0% 100%) !important');
      bodyEl?.setAttribute('style', 'background-color: hsl(0 0% 100%) !important');
      document.querySelectorAll('main').forEach(el => {
        (el as HTMLElement).style.backgroundColor = 'hsl(0 0% 100%)';
      });
    }
  }, [theme]);
  
  useEffect(() => {
    if (scrollThemeTransition) {
      // Set up scroll-based theme transition with smooth dark/light gradient
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const documentHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.min(100, Math.max(0, (scrollPosition / documentHeight) * 100));
        
        const root = window.document.documentElement;
        
        // Apply transition classes for smoother change
        if (scrollPercentage > 40) {
          if (!root.classList.contains("dark")) {
            root.classList.remove("light");
            root.classList.add("dark");
            root.style.setProperty('--theme-transition-factor', `${(scrollPercentage - 40) * 1.67}%`);
          }
        } else {
          if (!root.classList.contains("light")) {
            root.classList.remove("dark");
            root.classList.add("light");
            root.style.setProperty('--theme-transition-factor', `${100 - (scrollPercentage * 2.5)}%`);
          }
        }
        
        // Apply variable with scroll percentage to enable CSS interpolation
        root.style.setProperty('--scroll-position', `${scrollPercentage}%`);
      };
      
      // Run once to initialize
      setTimeout(() => {
        handleScroll();
      }, 50);
      
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // Clean up any scroll-based theme settings
      const root = window.document.documentElement;
      root.style.removeProperty('--scroll-position');
      root.style.removeProperty('--theme-transition-factor');
    }
  }, [scrollThemeTransition]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    scrollThemeTransition,
    setScrollThemeTransition: (enabled: boolean) => {
      localStorage.setItem("scroll-theme-transition", enabled.toString());
      setScrollThemeTransition(enabled);
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};