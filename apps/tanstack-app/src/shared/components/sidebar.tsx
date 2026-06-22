import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@repo/ui/components/ui/sidebar";
import { cn } from "@repo/ui/lib/utils";
import { ArrowLeftToLine, ArrowRightToLine, Library } from "lucide-react";
import { NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS } from "./nav-data";
import { NavSection } from "./nav-section";

interface AppSidebarProps {
  currentPath?: string;
  className?: string;
}

export function AppSidebar({ currentPath, className }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className={cn("border-r border-border bg-card", className)}>
      <SidebarHeader className="flex h-[72px] shrink-0 flex-row items-center gap-0 border-b border-border px-3 overflow-hidden">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Library size={22} />
        </div>
        <span className="ml-2 text-2xl font-bold tracking-tight text-primary truncate group-data-[collapsible=icon]:hidden">
          Bookary
        </span>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden px-3 pt-4">
        <NavSection title="MAIN MENU" visible={true} items={NAV_MAIN} currentPath={currentPath} />
        <NavSection title="MANAGEMENT" visible={true} items={NAV_MANAGEMENT} currentPath={currentPath} />
        <NavSection title="SETTING & OTHERS" visible={true} items={NAV_SETTINGS} currentPath={currentPath} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarToggleButton />
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarToggleButton() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        "flex w-full items-center justify-center rounded-lg h-10",
        "bg-muted text-muted-foreground",
        "hover:bg-accent hover:text-foreground",
        "transition-colors",
      )}
    >
      {open ? <ArrowLeftToLine size={18} /> : <ArrowRightToLine size={18} />}
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}
