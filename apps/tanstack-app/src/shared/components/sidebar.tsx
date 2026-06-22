import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@repo/ui/components/ui/sidebar";
import { ChevronsUpDown, Library, LogOut, Settings, User } from "lucide-react";
import { NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS } from "./nav-data";
import { NavSection } from "./nav-section";

interface AppSidebarProps {
  currentPath?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onSignOut?: () => void;
}

export function AppSidebar({ currentPath, userName, userEmail, userImage, onSignOut }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);
  const name = userName || "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarHeader className="flex h-[60px] shrink-0 flex-row items-center gap-0  px-3 overflow-hidden">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Library size={22} />
        </div>
        <span className="ml-2 text-2xl font-bold tracking-tight text-primary truncate group-data-[collapsible=icon]:hidden">
          Bookary
        </span>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden px-3 pt-4 gap-1">
        <NavSection
          title="MAIN MENU"
          visible={true}
          items={NAV_MAIN}
          currentPath={currentPath}
          onItemClick={closeMobile}
        />
        <NavSection
          title="MANAGEMENT"
          visible={true}
          items={NAV_MANAGEMENT}
          currentPath={currentPath}
          onItemClick={closeMobile}
        />
        <NavSection
          title="SETTING & OTHERS"
          visible={true}
          items={NAV_SETTINGS}
          currentPath={currentPath}
          onItemClick={closeMobile}
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-dashed border-border p-2 sm:p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors group-data-[collapsible=icon]:justify-center bg-muted"
            >
              <Avatar size="sm" className="shrink-0">
                <AvatarImage src={userImage} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <ChevronsUpDown
                size={14}
                className="shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
              />
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
              <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={onSignOut}>
                <LogOut size={16} />
                Sign out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
