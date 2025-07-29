import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type AuthUser } from "@/types";
import * as storage from "@/lib/storage";
import { getCurrentUser } from "@/lib/api";

type AuthCtx = {
  user: AuthUser | null;
  logout: () => void;
  login: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthCtx => {
  const ctx = use(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used within a descendant of AuthProvider");

  return ctx;
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthCtx["user"]>(null);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const logout = async () => {
    setUser(null);
    storage.removeItem();
    return navigate("/login", { viewTransition: true });
  };

  const login = (user: AuthUser) => {
    setUser(user);
    const url = pathname.startsWith("/login") ? "/" : pathname;
    return navigate(url, { viewTransition: true, replace: true });
  };

  useEffect(() => {
    if (user) return;
    const queries = new URLSearchParams(search);

    if (queries.has("token") || storage.getItem()) {
      if (queries.has("token")) {
        const token = queries.get("token")!;
        storage.setItem({ token });
      }

      (async () => {
        const res = await getCurrentUser();
        if (!res.ok) throw res;
        const { user }: { user: AuthUser } = await res.json();
        login(user);
      })();
    } else {
      navigate("/login", { viewTransition: true, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search]);

  return <AuthContext value={{ user, logout, login }}>{children}</AuthContext>;
}

export default AuthProvider;
