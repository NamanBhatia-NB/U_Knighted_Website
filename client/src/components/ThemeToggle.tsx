import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-background/10 backdrop-blur-sm 
              border border-gray-200/30 dark:border-gray-700/30 
              hover:bg-accent/10 hover:border-accent/30 
              dark:hover:bg-accent/20 dark:hover:border-accent/40
              focus:outline-none focus-visible:ring-1 focus-visible:ring-accent
              transition-all duration-200"
          >
            <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 text-amber-500 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 text-indigo-300 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[180px] rounded-lg border border-gray-200/30 dark:border-gray-700/30 
            bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg"
        >
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className={`${theme === 'light' ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent' : ''} 
              cursor-pointer font-medium text-gray-800 dark:text-white 
              hover:bg-accent/10 hover:text-accent dark:hover:bg-accent/20 dark:hover:text-accent
              transition-colors px-4 py-2 rounded-md my-1 mx-1`}
          >
            <Sun className="mr-3 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className={`${theme === 'dark' ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent' : ''} 
              cursor-pointer font-medium text-gray-800 dark:text-white 
              hover:bg-accent/10 hover:text-accent dark:hover:bg-accent/20 dark:hover:text-accent
              transition-colors px-4 py-2 rounded-md my-1 mx-1`}
          >
            <Moon className="mr-3 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className={`${theme === 'system' ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent' : ''} 
              cursor-pointer font-medium text-gray-800 dark:text-white 
              hover:bg-accent/10 hover:text-accent dark:hover:bg-accent/20 dark:hover:text-accent
              transition-colors px-4 py-2 rounded-md my-1 mx-1`}
          >
            <SunMoon className="mr-3 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}