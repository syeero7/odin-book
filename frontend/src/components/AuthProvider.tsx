import { createContext, use, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { type AuthUser } from "@/types";
import { logout as _logout } from "@/lib/api";
import * as storage from "@/lib/storage";

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
  const [user, setUser] = useState<AuthCtx["user"]>(storage.getItem);
  const navigate = useNavigate();

  const logout = async () => {
    const res = await _logout();
    if (!res.ok) throw res;

    setUser(null);
    storage.removeItem();
    return navigate("/login", { viewTransition: true });
  };

  const login = (user: AuthUser) => {
    setUser(user);
    storage.setItem(user);
    return navigate("/", { viewTransition: true, replace: true });
  };

  return <AuthContext value={{ user, logout, login }}>{children}</AuthContext>;
}

export default AuthProvider;
