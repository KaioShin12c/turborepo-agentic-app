import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";
import { cn } from "@repo/ui/lib/utils";
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
    <SidebarGroup className="first:mt-0 p-0">
      <SidebarGroupLabel
        className={cn(
          !visible && "lg:hidden",
          "mb-1 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground",
          "group-data-[collapsible=icon]:hidden",
        )}
      >
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = currentPath === item.path || (item.path !== "/" && currentPath?.startsWith(item.path));
          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={active}
                tooltip={item.label}
                size="lg"
                className={cn(
                  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                  "text-sidebar-foreground/80",
                  "hover:bg-muted hover:text-foreground",
                  "rounded-lg",
                  "h-10",
                  "gap-3",
                  "font-medium",
                  "duration-300",
                  "[&>svg]:size-[18px]",
                  "group-data-[collapsible=icon]:size-10!",
                  "group-data-[collapsible=icon]:justify-center",
                )}
              >
                <Link to={item.path} onClick={onItemClick} className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
