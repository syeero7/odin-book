import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function RouteController({ type }: { type: "public" | "private" }) {
  const { user } = useAuth();

  switch (type) {
    case "private":
      return user ? <Outlet /> : <Navigate to={"/login"} replace />;

    case "public":
      return !user ? <Outlet /> : <Navigate to={"/"} replace />;
  }
}

export default RouteController;
