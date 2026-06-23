import { Button } from "@repo/ui/components/ui/button";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Button variant="outline" size="icon" type="button" className="rounded-full" onClick={toggleTheme}>
      <Sun className="size-4 block dark:hidden" />
      <Moon className="size-4 hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
