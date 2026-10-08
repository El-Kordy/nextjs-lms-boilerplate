import { AppSidebar } from "@/components/layout/app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AppLayout({
  children,
  isAdmin,
  user,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar isAdmin={isAdmin} user={user} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}