import { Play, Lock } from "lucide-react";

export function VideoPlayer({ hasAccess = true }: { hasAccess?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="flex aspect-video w-full items-center justify-center bg-muted">
        {hasAccess ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Play className="ml-1 size-8 text-primary" />
            </div>
            <p className="text-xs">YouTube embed placeholder</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Lock className="size-10" />
            <p className="text-sm">You do not have access to this lesson.</p>
          </div>
        )}
      </div>
    </div>
  );
}
