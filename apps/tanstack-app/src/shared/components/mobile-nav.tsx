import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Separator } from "@repo/ui/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@repo/ui/components/ui/sheet";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { ChevronsUpDown, Library, LogOut, Settings, User } from "lucide-react";
import { NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS } from "./nav-data";
import { NavSection } from "./nav-section";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onSignOut?: () => void;
}

export function MobileNav({
  open,
  onOpenChange,
  currentPath,
  userName,
  userEmail,
  userImage,
  onSignOut,
}: MobileNavProps) {
  const close = () => onOpenChange(false);
  const initials = (userName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
        <SheetHeader className="flex h-[72px] shrink-0 flex-row items-center gap-3 border-b border-border px-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Library size={22} />
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight text-primary">Bookary</SheetTitle>
          <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
        </SheetHeader>
        <TooltipProvider delayDuration={0}>
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
            <NavSection
              title="MAIN MENU"
              visible={true}
              items={NAV_MAIN}
              currentPath={currentPath}
              onItemClick={close}
            />
            <NavSection
              title="MANAGEMENT"
              visible={true}
              items={NAV_MANAGEMENT}
              currentPath={currentPath}
              onItemClick={close}
            />
            <NavSection
              title="SETTING & OTHERS"
              visible={true}
              items={NAV_SETTINGS}
              currentPath={currentPath}
              onItemClick={close}
            />
          </div>
        </TooltipProvider>

        <Separator />
        <div className="shrink-0 px-3 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-muted/60 transition-colors"
              >
                <Avatar size="sm">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
                <ChevronsUpDown size={14} className="text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-56">
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
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => {
                    close();
                    onSignOut();
                  }}
                >
                  <LogOut size={16} />
                  Sign out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
}
