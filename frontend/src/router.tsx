import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Fallback from "@/components/Fallback";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteController from "@/components/RouteController";

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary,
    HydrateFallback: Fallback,
    children: [
      {
        element: <RouteController type="public" />,
        children: [
          {
            path: "login",
            lazy: async () => {
              const module = await import("@/pages/Login");

              return { Component: module.default };
            },
          },
        ],
      },
      {
        element: <RouteController type="private" />,
        children: [],
      },
    ],
  },
]);
