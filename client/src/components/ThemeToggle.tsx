import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-background/10 backdrop-blur-sm border-white/10 dark:border-gray-800/30 hover:bg-accent hover:text-white dark:text-white dark:hover:text-white"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px] theme-aware-glass">
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className={`${theme === 'light' ? 'bg-accent/50' : ''} cursor-pointer text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent`}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className={`${theme === 'dark' ? 'bg-accent/50' : ''} cursor-pointer text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent`}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className={`${theme === 'system' ? 'bg-accent/50' : ''} cursor-pointer text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent`}
          >
            <SunMoon className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}