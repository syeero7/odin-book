import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Fallback from "@/components/Fallback";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteController from "@/components/RouteController";
import { action as getPostActions } from "@/components/Post";

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary,
    HydrateFallback: Fallback,
    children: [
      {
        ErrorBoundary,
        element: <RouteController type="public" />,
        children: [
          {
            path: "login",
            lazy: async () => {
              const module = await import("@/pages/Login");
              return {
                Component: module.default,
              };
            },
          },
        ],
      },
      {
        ErrorBoundary,
        element: <RouteController type="private" />,
        children: [
          {
            index: true,
            lazy: async () => {
              const module = await import("@/pages/Home");
              return {
                Component: module.default,
                loader: module.loader,
              };
            },
          },
          {
            path: "posts/:postId/delete",
            action: getPostActions("delete"),
          },
          {
            path: "posts/:postId/like",
            action: getPostActions("like"),
          },
        ],
      },
    ],
  },
]);
