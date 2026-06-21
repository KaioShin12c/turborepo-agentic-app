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
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Books", icon: BookOpen, path: "/books" },
  { label: "Library Activities", icon: BarChart3, path: "/activities" },
  { label: "Members", icon: Users, path: "/members" },
];

export const NAV_MANAGEMENT: NavItem[] = [
  { label: "Report & Analytics", icon: BarChart3, path: "/reports" },
  { label: "Overdue Reminder", icon: Bell, path: "/overdue" },
  { label: "Add Books", icon: PlusCircle, path: "/books/add" },
  { label: "Fines & Fees", icon: ReceiptText, path: "/fines" },
];

export const NAV_SETTINGS: NavItem[] = [
  { label: "Setting", icon: Settings, path: "/settings" },
  { label: "Help & Support", icon: HelpCircle, path: "/help" },
];
