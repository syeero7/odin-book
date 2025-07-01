import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import App from "./App";
import RouteController from "./components/RouteController";

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
  {
    path: "/",
    Component: App,
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
