import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentSession } from "../../features/auth/auth.functions";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getCurrentSession();

    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});
