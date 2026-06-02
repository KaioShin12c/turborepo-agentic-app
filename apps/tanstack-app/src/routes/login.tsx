import { createFileRoute, redirect } from "@tanstack/react-router";

import LoginPage from "../components/login-page";
import { getCurrentSession } from "../lib/auth.functions";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getCurrentSession();

    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
