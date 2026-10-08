"use client";

import {
  BookOpen,
  HelpCircle,
  Users,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CURRENT_USER = {
  name: "WNM Admin",
  email: "admin@wnm.local",
  avatar: undefined,
};

const STATS = [
  {
    label: "Total Users",
    value: 45,
    icon: Users,
    description: "Registered users",
  },
  {
    label: "Published Courses",
    value: 3,
    icon: BookOpen,
    description: "Courses available on the platform",
  },
  {
    label: "Unanswered Questions",
    value: 7,
    icon: HelpCircle,
    description: "Across all courses",
  },
];

export default function AdminHomePage() {
  return (
    <AppLayout user={CURRENT_USER} isAdmin={true}>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of the WNM learning platform
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
