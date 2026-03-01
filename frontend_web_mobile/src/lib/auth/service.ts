import type { ApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/client";
import type { AuthTokenProvider } from "@/lib/auth/token";

export type AuthUser = {
  user_id: string;
  claims: Record<string, unknown>;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type TokenResponse = {
  access_token: string;
  token_type: "bearer" | string;
};

type RegisterRequest = {
  email: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
  mfa_code?: string;
};

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new ApiError(`API request failed: ${res.status} ${res.statusText}`, res.status, text);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function postJson<T>(apiBaseUrl: string, path: string, body: unknown): Promise<T> {
  const trimmedBase = apiBaseUrl.replace(/\/+$/, "");
  const url = `${trimmedBase}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return parseJsonOrThrow<T>(res);
}

async function getJsonAuthed<T>(
  apiBaseUrl: string,
  path: string,
  token: string
): Promise<T> {
  const trimmedBase = apiBaseUrl.replace(/\/+$/, "");
  const url = `${trimmedBase}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  return parseJsonOrThrow<T>(res);
}

/**
 * PUBLIC_INTERFACE
 * Register a new user, persist token, and return session details.
 */
export async function registerAndCreateSession(opts: {
  apiBaseUrl: string;
  email: string;
  password: string;
  tokenProvider: AuthTokenProvider;
}): Promise<AuthSession> {
  const tokenRes = await postJson<TokenResponse>(opts.apiBaseUrl, "/auth/register", {
    email: opts.email,
    password: opts.password,
  } satisfies RegisterRequest);

  await opts.tokenProvider.setToken(tokenRes.access_token);
  const user = await getJsonAuthed<AuthUser>(opts.apiBaseUrl, "/auth/me", tokenRes.access_token);

  return { token: tokenRes.access_token, user };
}

/**
 * PUBLIC_INTERFACE
 * Login user, persist token, and return session details.
 */
export async function loginAndCreateSession(opts: {
  apiBaseUrl: string;
  email: string;
  password: string;
  mfaCode?: string;
  tokenProvider: AuthTokenProvider;
}): Promise<AuthSession> {
  const tokenRes = await postJson<TokenResponse>(opts.apiBaseUrl, "/auth/login", {
    email: opts.email,
    password: opts.password,
    mfa_code: opts.mfaCode,
  } satisfies LoginRequest);

  await opts.tokenProvider.setToken(tokenRes.access_token);
  const user = await getJsonAuthed<AuthUser>(opts.apiBaseUrl, "/auth/me", tokenRes.access_token);

  return { token: tokenRes.access_token, user };
}

/**
 * PUBLIC_INTERFACE
 * Load current user (if token exists). Returns null if unauthenticated.
 */
export async function loadCurrentUser(opts: {
  api: ApiClient | null;
  tokenProvider: AuthTokenProvider;
}): Promise<AuthUser | null> {
  const token = await opts.tokenProvider.getToken();
  if (!token) return null;
  if (!opts.api) return null;

  try {
    return await opts.api.requestJson<AuthUser>("/auth/me", { method: "GET" });
  } catch (e) {
    // If token is invalid/expired, clear it.
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
      await opts.tokenProvider.setToken(null);
      return null;
    }
    throw e;
  }
}
