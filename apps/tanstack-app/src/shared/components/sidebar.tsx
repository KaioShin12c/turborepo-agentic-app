import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from "@repo/ui/components/ui/sidebar";
import { Library } from "lucide-react";
import { NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS } from "./nav-data";
import { NavSection } from "./nav-section";

interface AppSidebarProps {
  currentPath?: string;
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);

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
    </Sidebar>
  );
}
