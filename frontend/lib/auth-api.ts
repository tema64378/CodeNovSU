import { appConfig } from "@/lib/config";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/lib/auth-types";

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

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return authRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return authRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(token: string): Promise<AuthUser> {
  return authRequest<AuthUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
