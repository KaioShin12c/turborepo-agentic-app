import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/ui/tooltip";
import { Link } from "@tanstack/react-router";

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
}

interface NavSectionProps {
  title: string;
  visible: boolean;
  items: NavItem[];
  currentPath?: string;
  onItemClick?: () => void;
}

export function NavSection({ title, visible, items, currentPath, onItemClick }: NavSectionProps) {
  return (
    <div className="mt-6 first:mt-0">
      <div
        className={`mb-3 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground px-2 overflow-hidden whitespace-nowrap transition-[max-width,opacity,padding] duration-300 ${
          visible ? "max-w-48 opacity-100" : "max-w-0 opacity-0 lg:px-0"
        }`}
      >
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = currentPath === item.path || (item.path !== "/" && currentPath?.startsWith(item.path));
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  onClick={onItemClick}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 h-10 text-sm font-medium transition-[width,height,padding,gap] duration-300 ${
                    visible ? "" : "lg:size-10 lg:p-0 lg:gap-0"
                  } ${active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/80 hover:bg-muted"}`}
                >
                  <item.icon size={18} />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ${visible ? "max-w-48 opacity-100" : "max-w-0 opacity-0"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" hidden={visible}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </div>
  );
}
