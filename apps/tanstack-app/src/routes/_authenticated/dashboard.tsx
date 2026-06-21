import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "../../features/dashboard/components/dashboard-page";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  const { session } = Route.useRouteContext();

  return <DashboardPage session={session} />;
}
