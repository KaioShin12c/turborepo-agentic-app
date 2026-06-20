import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Bell, Globe, Search, UserPlus } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

interface TopBarProps {
  userName: string;
}

export function TopBar({ userName }: TopBarProps) {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-background px-6 h-[72px] shrink-0">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Good morning {userName} 👋</p>
      </div>

      <div className="ml-6 flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="type here to search anything"
            className="h-11 rounded-2xl border-border bg-muted/60 pl-11 pr-16 text-sm outline-none"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
            ⌘F
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
        >
          <Globe size={18} />
        </button>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
        >
          <Bell size={18} />
        </button>
        <Button className="h-10 gap-2 rounded-2xl px-5 text-sm font-semibold">
          <UserPlus size={16} />
          Add Member
        </Button>
      </div>
    </header>
  );
}
