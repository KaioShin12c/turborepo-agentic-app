import { authClient } from "@repo/auth/client";
import { createFileRoute, Outlet, redirect, useRouter, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { getCurrentSession } from "../../features/auth/auth.functions";
import { Sidebar } from "../../shared/components/sidebar";
import { TopBar } from "../../shared/components/top-bar";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const session = await getCurrentSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { session };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSignOutError(null);
    try {
      const { error } = await authClient.signOut({
        fetchOptions: { onSuccess: () => router.navigate({ to: "/login" }) },
      });
      if (error) setSignOutError(error.message || "Unable to sign out.");
    } catch {
      setSignOutError("Unable to sign out right now.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      <Sidebar sidebarOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} currentPath={currentPath} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar session={session} onSignOut={handleSignOut} />

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {signOutError && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {signOutError}
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
