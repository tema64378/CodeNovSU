"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { getCurrentUser, login as loginRequest, register as registerRequest } from "@/lib/auth-api";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/lib/auth-types";

const AUTH_STORAGE_KEY = "codenovsu.auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistSession(session: AuthResponse | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function readSession(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readSession();
    if (!session?.access_token) {
      setIsLoading(false);
      return;
    }

    setToken(session.access_token);
    setUser(session.user);

    getCurrentUser(session.access_token)
      .then((nextUser) => {
        setUser(nextUser);
        persistSession({
          ...session,
          user: nextUser,
        });
      })
      .catch(() => {
        persistSession(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      async login(payload) {
        const session = await loginRequest(payload);
        persistSession(session);
        setUser(session.user);
        setToken(session.access_token);
        return session.user;
      },
      async register(payload) {
        const session = await registerRequest(payload);
        persistSession(session);
        setUser(session.user);
        setToken(session.access_token);
        return session.user;
      },
      logout() {
        persistSession(null);
        setUser(null);
        setToken(null);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
