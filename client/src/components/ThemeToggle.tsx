import { Moon, Sun, SunMoon, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, setTheme, scrollThemeTransition, setScrollThemeTransition } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-background/10 backdrop-blur-sm border-white/10 dark:border-gray-800/30 hover:bg-accent hover:text-accent-foreground"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] theme-aware-glass">
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className={`${theme === 'light' && !scrollThemeTransition ? 'bg-accent/50' : ''} cursor-pointer`}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className={`${theme === 'dark' && !scrollThemeTransition ? 'bg-accent/50' : ''} cursor-pointer`}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className={`${theme === 'system' && !scrollThemeTransition ? 'bg-accent/50' : ''} cursor-pointer`}
          >
            <SunMoon className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-2 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ScrollText className="h-4 w-4" />
              <Label htmlFor="scroll-theme" className="text-sm cursor-pointer">Theme follows scroll</Label>
            </div>
            <Switch 
              id="scroll-theme"
              checked={scrollThemeTransition}
              onCheckedChange={setScrollThemeTransition}
              className={scrollThemeTransition ? "bg-accent" : ""}
            />
          </div>
          {scrollThemeTransition && (
            <div className="px-2 py-2 text-xs text-muted-foreground">
              Theme changes as you scroll down the page
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}