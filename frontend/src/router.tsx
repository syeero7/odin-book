import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Fallback from "@/components/Fallback";
import ErrorBoundary from "@/components/ErrorBoundary";
import { action as getPostActions } from "@/components/Post";
import { action as getCommentActions } from "@/components/Comment";
import { action as followUserAction } from "@/components/FollowButton";

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary,
    HydrateFallback: Fallback,
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
      // ---- private routes ----
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
        path: "posts/:postId",
        lazy: async () => {
          const module = await import("@/pages/SelectedPost");
          return {
            Component: module.default,
            loader: module.loader,
          };
        },
      },
      {
        path: "posts/new",
        lazy: async () => {
          const module = await import("@/pages/CreatePost");
          return {
            Component: module.default,
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
      {
        path: "posts/:postId/comment",
        action: getCommentActions("create"),
      },
      {
        path: "comments/:commentId/delete",
        action: getCommentActions("delete"),
      },
      {
        path: "/search",
        lazy: async () => {
          const module = await import("@/pages/Search");
          return {
            Component: module.default,
            loader: module.loader,
          };
        },
      },
      {
        path: "/users/:userId/follow",
        action: followUserAction,
      },
      {
        path: "/notifications",
        lazy: async () => {
          const module = await import("@/pages/Notifications");
          return {
            Component: module.default,
            loader: module.loader,
          };
        },
      },
    ],
  },
]);
