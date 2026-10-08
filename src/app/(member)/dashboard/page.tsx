import { AppLayout } from "@/components/layout/app-layout";
import { dashboardService } from "@/features/dashboard";
import { AnnouncementCard } from "@/features/dashboard/components/announcement-card";
import { ActivityFeed } from "@/features/dashboard/components/activity-feed";
import { CourseCard } from "@/features/courses/components/course-card";

// TODO: replace with real auth session
const CURRENT_USER = {
  name: "Rahim Uddin",
  email: "rahim@example.com",
  avatar: undefined,
};

export default async function DashboardPage() {
  const data = await dashboardService.getData();

  return (
    <AppLayout user={CURRENT_USER} isAdmin={false}>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {CURRENT_USER.name.split(" ")[0]}
          </p>
        </div>

        <div className="mt-6">
          <AnnouncementCard announcement={data.announcement} />
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">
            My courses
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <ActivityFeed activities={data.recentActivity} />
        </div>
      </div>
    </AppLayout>
  );
}
