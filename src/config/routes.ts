export const ROUTES = {
  // Public
  home: "/",
  login: "/login",
  onboarding: "/onboarding",

  // Member
  dashboard: "/dashboard",
  courses: "/courses",
  courseDetail: (courseId: string) => `/courses/${courseId}` as const,
  courseVideo: (courseId: string, videoId: string) =>
    `/courses/${courseId}/videos/${videoId}` as const,
  profile: "/profile",

  // Admin
  admin: "/admin",
  adminCourses: "/admin/courses",
  adminCourseVideos: (courseId: string) =>
    `/admin/courses/${courseId}/videos` as const,
  adminQuestions: "/admin/questions",
  adminSettings: "/admin/settings",
} as const;
