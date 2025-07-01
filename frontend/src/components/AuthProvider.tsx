import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { type AuthUser } from "../types";
import * as storage from "../lib/storage";

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

  useEffect(() => {
    if (!user) {
      storage.removeItem();
      navigate("/");
      return;
    }

    storage.setItem(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const logout = () => setUser(null);
  const login = (user: AuthUser) => setUser(user);

  return <AuthContext value={{ user, logout, login }}>{children}</AuthContext>;
}

export default AuthProvider;
