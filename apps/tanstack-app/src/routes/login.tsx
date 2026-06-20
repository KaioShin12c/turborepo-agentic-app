import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentSession } from "../features/auth/auth.functions";
import LoginPage from "../features/auth/components/login-page";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getCurrentSession();

    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
