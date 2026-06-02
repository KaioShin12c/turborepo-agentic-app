import { createFileRoute, redirect } from "@tanstack/react-router";

import DashboardPage from "../components/dashboard-page";
import { getCurrentSession } from "../lib/auth.functions";

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
