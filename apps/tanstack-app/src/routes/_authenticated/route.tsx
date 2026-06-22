import { authClient } from "@repo/auth/client";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { createFileRoute, Outlet, redirect, useRouter, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { getCurrentSession } from "../../features/auth/auth.functions";
import { MobileNav } from "../../shared/components/mobile-nav";
import { AppSidebar } from "../../shared/components/sidebar";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
    <SidebarProvider defaultOpen={true} style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <AppSidebar currentPath={currentPath} className="hidden lg:flex" />

      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        currentPath={currentPath}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image || ""}
        onSignOut={handleSignOut}
      />

      <SidebarInset className="min-w-0 overflow-hidden">
        <TopBar session={session} onSignOut={handleSignOut} onOpenMobileNav={() => setMobileNavOpen(true)} />

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
      </SidebarInset>
    </SidebarProvider>
  );
}
