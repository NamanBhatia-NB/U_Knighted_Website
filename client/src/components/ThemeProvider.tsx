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
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null
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

  // Handle theme changes
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

    // Set theme color in localStorage for scroll transitions
    localStorage.setItem("theme", theme);

    // Set base background transition color based on theme
    if (appliedTheme === "dark") {
      root.style.setProperty('--background-transition', 'hsl(224 71% 4%)');
    } else {
      root.style.setProperty('--background-transition', 'hsl(0 0% 100%)');
    }

    // Apply immediate background colors to prevent flashing
    // These will be transitioned by CSS
    if (appliedTheme === "dark") {
      document.querySelectorAll('main').forEach(el => {
        (el as HTMLElement).style.backgroundColor = 'hsl(224 71% 4%)';
      });
    } else {
      document.querySelectorAll('main').forEach(el => {
        (el as HTMLElement).style.backgroundColor = 'hsl(0 0% 100%)';
      });
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
      window.location.reload();
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