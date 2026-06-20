import {
  BarChart3,
  Bell,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";
import type { NavItem } from "./nav-section";

export const NAV_MAIN: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Books", icon: BookOpen },
  { label: "Library Activities", icon: BarChart3 },
  { label: "Members", icon: Users },
];

export const NAV_MANAGEMENT: NavItem[] = [
  { label: "Report & Analytics", icon: BarChart3 },
  { label: "Overdue Reminder", icon: Bell },
  { label: "Add Books", icon: PlusCircle },
  { label: "Fines & Fees", icon: ReceiptText },
];

export const NAV_SETTINGS: NavItem[] = [
  { label: "Setting", icon: Settings },
  { label: "Help & Support", icon: HelpCircle },
];
