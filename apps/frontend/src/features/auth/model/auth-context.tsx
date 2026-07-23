"use client";

import * as React from "react";
import type { AuthResponse } from "@expense-tracker/shared";
import type { UserPublic } from "@/entities/user";
import { getAccessToken, setAccessToken } from "@/shared/api/client";

const USER_STORAGE_KEY = "auth_user";

type AuthContextValue = {
  user: UserPublic | null;
  isReady: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserPublic | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const token = getAccessToken();
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    if (token && storedUser) {
      setUser(JSON.parse(storedUser) as UserPublic);
    }
    setIsReady(true);
  }, []);

  const login = React.useCallback((auth: AuthResponse) => {
    setAccessToken(auth.accessToken);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(auth.user));
    setUser(auth.user);
  }, []);

  const logout = React.useCallback(() => {
    setAccessToken(null);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, isReady, login, logout }),
    [user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return ctx;
}
