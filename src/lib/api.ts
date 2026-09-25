import { type AuthTokens, type SessionProfile, type SessionUser, ROLE_HOME } from "./session";

export type { AuthTokens, SessionProfile, SessionUser, UserRole } from "./session";

const LS_TOKEN = "agriksense_token";
const LS_REFRESH = "agriksense_refresh";
const LS_USER = "agriksense_user";

/**
 * Same-origin by default; the Next rewrite in next.config.ts proxies /api/* to the
 * Fastify server. Set NEXT_PUBLIC_API_BASE to talk to a deployed API directly.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LS_TOKEN);
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(LS_USER) || "null") as SessionUser | null;
  } catch {
    return null;
  }
}

export function storeSession(data: SessionUser & AuthTokens) {
  window.localStorage.setItem(LS_TOKEN, data.accessToken);
  window.localStorage.setItem(LS_REFRESH, data.refreshToken);
  window.localStorage.setItem(LS_USER, JSON.stringify(data));
}

export function clearSession() {
  window.localStorage.removeItem(LS_TOKEN);
  window.localStorage.removeItem(LS_REFRESH);
  window.localStorage.removeItem(LS_USER);
}

export function userDisplay(user: SessionUser | null): string {
  const profile: SessionProfile | null | undefined = user?.profile;
  if (!profile) return "Operator";
  if (profile.type === "organization") return profile.orgName || "Operator";
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Operator";
}

export function userInitial(user: SessionUser | null): string {
  return (user?.profile?.firstName || "A").charAt(0).toUpperCase();
}

/** Dashboard pages: no session means straight to /login, like the legacy scripts partial. */
export function requireSession(): SessionUser | null {
  if (!getToken()) {
    window.location.replace("/login");
    return null;
  }
  const user = getStoredUser();
  const home = user ? ROLE_HOME[user.role] : null;
  if (home && window.location.pathname !== home) window.location.replace(home);
  return user;
}

export class ApiError extends Error {
  status: number;
  errors?: { message: string }[];

  constructor(message: string, status: number, errors?: { message: string }[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function errorMessage(data: unknown, fallback: string): string {
  const body = data as { errors?: { message: string }[]; message?: string } | null;
  if (body?.errors?.length) return body.errors[0].message;
  if (body?.message) return body.message;
  return fallback;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = window.localStorage.getItem(LS_REFRESH);
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    const data = (await res.json()) as { data?: AuthTokens };
    if (!res.ok || !data.data) {
      clearSession();
      return false;
    }
    window.localStorage.setItem(LS_TOKEN, data.data.accessToken);
    window.localStorage.setItem(LS_REFRESH, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/** Authenticated JSON request. Retries once after refreshing an expired access token. */
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const send = async () => {
    const token = getToken();
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  };

  let res = await send();
  if (res.status === 401 && (await refreshAccessToken())) res = await send();

  if (res.status === 401) {
    clearSession();
    if (!window.location.pathname.startsWith("/login")) window.location.replace("/login");
    throw new ApiError("Unauthorized", 401);
  }

  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) throw new ApiError(data?.message || "Request failed", res.status);
  return data;
}
