import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@repo/auth/server";

export const getCurrentSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();

    return auth.api.getSession({ headers });
  },
);
