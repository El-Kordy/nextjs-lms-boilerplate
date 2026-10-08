import {
  Home,
  BookOpen,
  User,
  FolderOpen,
  HelpCircle,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { ROUTES } from "@/config/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const memberNav: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: Home },
  { label: "Courses", href: ROUTES.courses, icon: BookOpen },
  { label: "Profile", href: ROUTES.profile, icon: User },
];

export const adminNav: NavItem[] = [
  { label: "Admin Home", href: ROUTES.admin, icon: LayoutDashboard },
  { label: "Manage Courses", href: ROUTES.adminCourses, icon: FolderOpen },
  { label: "Questions", href: ROUTES.adminQuestions, icon: HelpCircle },
  { label: "Settings", href: ROUTES.adminSettings, icon: Settings },
];
