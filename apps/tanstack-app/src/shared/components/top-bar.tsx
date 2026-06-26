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
import { Separator } from "@repo/ui/components/ui/separator";
import { useSidebar } from "@repo/ui/components/ui/sidebar";
import { ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import { LibrarySelector } from "./library-selector";
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
    <header className="flex items-center gap-2 sm:gap-4 border-b border-border bg-background px-3 sm:px-4 h-14 sm:h-[60px] shrink-0">
      <SidebarToggle />
      <div className="flex items-center h-full">
        <Separator orientation="vertical" className="h-8" />
        <LibrarySelector />
      </div>
      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-4">
        <ModeToggle />

        {/* <button
          type="button"
          aria-label="Notifications"
          className="grid size-9 sm:size-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <Bell size={18} />
        </button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="User menu"
              className="flex items-center gap-2.5 rounded-2xl text-sm hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Avatar size="default">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start min-w-0">
                <span className="text-sm font-medium leading-tight truncate max-w-[120px]">{userName}</span>
                <span className="text-xs text-muted-foreground leading-tight truncate max-w-[120px]">{userEmail}</span>
              </div>
              <ChevronDown size={14} className="hidden sm:block text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <div>
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
            </div>
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

function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className="grid size-9 place-items-center rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
    >
      <Menu size={20} />
    </button>
  );
}
