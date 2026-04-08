import { appConfig } from "@/lib/config";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/lib/auth-types";

const LOCAL_USERS_STORAGE_KEY = "codenovsu.local-users";
const LOCAL_TOKEN_PREFIX = "local-auth:";

interface LocalStoredUser {
  id: string;
  email: string;
  password: string;
  display_name: string;
  created_at: string;
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as T | { detail?: string } | null;

  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && "detail" in payload && payload.detail
        ? payload.detail
        : "Request failed.";
    throw new Error(detail);
  }

  return payload as T;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isDatabaseUnavailableError(error: unknown) {
  return error instanceof Error && /database is unavailable/i.test(error.message);
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError;
}

function isLocalToken(token: string) {
  return token.startsWith(LOCAL_TOKEN_PREFIX);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildAuthUser(user: LocalStoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    email_verified: true,
    role: "student",
    locale: "ru",
  };
}

function buildLocalSession(user: LocalStoredUser): AuthResponse {
  return {
    access_token: `${LOCAL_TOKEN_PREFIX}${user.id}`,
    token_type: "bearer",
    user: buildAuthUser(user),
  };
}

function readLocalUsers(): LocalStoredUser[] {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as LocalStoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(LOCAL_USERS_STORAGE_KEY);
    return [];
  }
}

function persistLocalUsers(users: LocalStoredUser[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(users));
}

function registerLocally(payload: RegisterPayload): AuthResponse {
  const users = readLocalUsers();
  const email = normalizeEmail(payload.email);

  if (users.some((user) => user.email === email)) {
    throw new Error("Аккаунт с таким email уже существует.");
  }

  const user: LocalStoredUser = {
    id: globalThis.crypto?.randomUUID?.() ?? `local-user-${Date.now()}`,
    email,
    password: payload.password,
    display_name: payload.display_name.trim(),
    created_at: new Date().toISOString(),
  };

  users.push(user);
  persistLocalUsers(users);

  return buildLocalSession(user);
}

function loginLocally(payload: LoginPayload): AuthResponse {
  const users = readLocalUsers();
  const email = normalizeEmail(payload.email);
  const user = users.find((candidate) => candidate.email === email);

  if (!user || user.password !== payload.password) {
    throw new Error("Неверный email или пароль.");
  }

  return buildLocalSession(user);
}

function getLocalUserFromToken(token: string): AuthUser {
  const userId = token.slice(LOCAL_TOKEN_PREFIX.length);
  const user = readLocalUsers().find((candidate) => candidate.id === userId);

  if (!user) {
    throw new Error("Локальная сессия не найдена. Войди снова.");
  }

  return buildAuthUser(user);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    return await authRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (isBrowser() && (isDatabaseUnavailableError(error) || isNetworkError(error))) {
      return loginLocally(payload);
    }
    throw error;
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    return await authRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (isBrowser() && (isDatabaseUnavailableError(error) || isNetworkError(error))) {
      return registerLocally(payload);
    }
    throw error;
  }
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  if (isLocalToken(token)) {
    return getLocalUserFromToken(token);
  }

  return authRequest<AuthUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
