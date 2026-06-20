import type { AuthSession } from "@repo/auth/server";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Input } from "@repo/ui/components/ui/input";
import { Bell, ChevronDown, Globe, LogOut, Search, Settings, User } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

interface TopBarProps {
  session: AuthSession;
  onSignOut?: () => void;
}

export function TopBar({ session, onSignOut }: TopBarProps) {
  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.image || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-2xl px-2.5 py-1.5 text-sm hover:bg-muted/60 transition-colors"
            >
              <Avatar size="sm">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-medium leading-tight truncate max-w-[120px]">{userName}</span>
                <span className="text-xs text-muted-foreground leading-tight truncate max-w-[120px]">{userEmail}</span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <div className="flex items-center gap-3 px-2 py-2.5">
              <Avatar size="lg">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">{userName}</span>
                <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
                <Badge variant="secondary" className="mt-1 w-fit text-[10px] px-1.5 py-0">
                  Member
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User size={16} />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings size={16} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onSignOut && (
              <DropdownMenuItem variant="destructive" onClick={onSignOut} className="cursor-pointer">
                <LogOut size={16} />
                Sign out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
