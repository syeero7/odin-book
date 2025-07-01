import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "./App";
import Fallback from "./components/Fallback";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteController from "./components/RouteController";

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
        children: [],
      },
      {
        element: <RouteController type="private" />,
        children: [],
      },
    ],
  },
]);
