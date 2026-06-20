import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/ui/tooltip";

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  active?: boolean;
  action?: string;
}

interface NavSectionProps {
  title: string;
  visible: boolean;
  items: NavItem[];
  onAction?: (action: string) => void;
}

export function NavSection({ title, visible, items, onAction }: NavSectionProps) {
  return (
    <div className="mt-6 first:mt-0">
      <div
        className={`mb-3 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground px-2 ${
          visible ? "" : "lg:hidden"
        }`}
      >
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => item.action && onAction?.(item.action)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 h-10 text-sm font-medium transition-colors ${
                  visible ? "" : "lg:size-10 lg:justify-center lg:p-0 lg:gap-0"
                } ${item.active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/80 hover:bg-muted"}`}
              >
                <item.icon size={18} />
                <span className={visible ? "" : "lg:hidden"}>{item.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" hidden={visible}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </div>
  );
}
