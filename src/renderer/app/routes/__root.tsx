import { lazy } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Provider } from "@app/components/ui/provider";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() => import("@tanstack/router-devtools").then((res) => ({ default: res.TanStackRouterDevtools })));

export const Route = createRootRoute({
  component: () => (
    <Provider>
      <Outlet />
      <TanStackRouterDevtools />
    </Provider>
  ),
});
