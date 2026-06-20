import { auth } from "@repo/auth/server";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getCurrentSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();

  return auth.api.getSession({ headers });
});
