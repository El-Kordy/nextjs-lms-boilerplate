import type { CourseWithProgress } from "@/types";

export type { CourseWithProgress };

export type ActivityItem = {
  icon: "watched" | "message" | "started";
  text: string;
  time: string;
};

export interface DashboardData {
  courses: CourseWithProgress[];
  announcement: string | null;
  recentActivity: ActivityItem[];
}
