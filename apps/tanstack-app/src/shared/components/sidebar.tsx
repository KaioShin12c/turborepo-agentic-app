import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/ui/tooltip";
import { ChevronLeft, Library } from "lucide-react";
import { NAV_MAIN, NAV_MANAGEMENT, NAV_SETTINGS } from "./nav-data";
import { NavSection } from "./nav-section";

interface SidebarProps {
  sidebarOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ sidebarOpen, onToggle }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`flex h-full shrink-0 flex-col border-r border-border bg-card transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden lg:w-16"
        }`}
      >
        <div className="flex h-[72px] shrink-0 items-center border-b border-border px-3 overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Library size={22} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" hidden={sidebarOpen}>
              Bookary
            </TooltipContent>
          </Tooltip>
          <span
            className={`ml-2 text-2xl font-bold tracking-tight text-primary overflow-hidden whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? "max-w-48 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Bookary
          </span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-4">
          <NavSection title="MAIN MENU" visible={sidebarOpen} items={NAV_MAIN} />
          <NavSection title="MANAGEMENT" visible={sidebarOpen} items={NAV_MANAGEMENT} />
          <NavSection title="SETTING & OTHERS" visible={sidebarOpen} items={NAV_SETTINGS} />
        </div>

        <div className="shrink-0 p-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-lg h-10 bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ChevronLeft size={18} className={sidebarOpen ? "" : "rotate-180"} />
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
