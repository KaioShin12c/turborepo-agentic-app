import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentSession } from "../features/auth/auth.functions";
import DashboardPage from "../features/dashboard/components/dashboard-page";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getCurrentSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { session };
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  const { session } = Route.useRouteContext();

  return <DashboardPage session={session} />;
}
