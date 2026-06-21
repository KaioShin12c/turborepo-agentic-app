import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "../../features/auth/components/signup-page";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});
