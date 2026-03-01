"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { createBrowserApiClient } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { createBrowserLocalStorageTokenProvider } from "@/lib/auth/token";
import type { AuthUser } from "@/lib/auth/service";
import { loginAndCreateSession, registerAndCreateSession } from "@/lib/auth/service";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  apiBaseUrlMissing: boolean;
  errorMessage: string | null;

  login: (opts: { email: string; password: string; mfaCode?: string }) => Promise<void>;
  register: (opts: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * PUBLIC_INTERFACE
 * Hook to access auth state + actions.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}

function getApiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? null;
}

/**
 * PUBLIC_INTERFACE
 * Client-side auth provider (static-export compatible).
 *
 * - Persists JWT token in localStorage.
 * - Loads /auth/me on mount when token exists.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const tokenProvider = useMemo(() => createBrowserLocalStorageTokenProvider(), []);
  const api = useMemo(() => createBrowserApiClient(), []);
  const apiBaseUrl = getApiBaseUrl();

  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiBaseUrlMissing = !apiBaseUrl;

  const refresh = useCallback(async () => {
    setErrorMessage(null);

    const currentToken = await tokenProvider.getToken();
    setToken(currentToken);

    if (!currentToken) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    if (!api) {
      // Env var not configured; we can’t validate session.
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    try {
      const me = await api.requestJson<AuthUser>("/auth/me", { method: "GET" });
      setUser(me);
      setStatus("authenticated");
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        await tokenProvider.setToken(null);
        setToken(null);
        setUser(null);
        setStatus("unauthenticated");
        return;
      }
      setStatus("unauthenticated");
      setErrorMessage(e instanceof Error ? e.message : "Failed to load session");
    }
  }, [api, tokenProvider]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async ({ email, password, mfaCode }: { email: string; password: string; mfaCode?: string }) => {
      setErrorMessage(null);
      if (!apiBaseUrl) {
        setErrorMessage("Missing env var: NEXT_PUBLIC_API_BASE_URL");
        return;
      }

      setStatus("loading");
      try {
        const session = await loginAndCreateSession({
          apiBaseUrl,
          email,
          password,
          mfaCode,
          tokenProvider,
        });
        setToken(session.token);
        setUser(session.user);
        setStatus("authenticated");
      } catch (e) {
        setStatus("unauthenticated");
        setUser(null);
        setToken(null);
        setErrorMessage(e instanceof ApiError ? e.bodyText || e.message : e instanceof Error ? e.message : "Login failed");
      }
    },
    [apiBaseUrl, tokenProvider]
  );

  const register = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setErrorMessage(null);
      if (!apiBaseUrl) {
        setErrorMessage("Missing env var: NEXT_PUBLIC_API_BASE_URL");
        return;
      }

      setStatus("loading");
      try {
        const session = await registerAndCreateSession({ apiBaseUrl, email, password, tokenProvider });
        setToken(session.token);
        setUser(session.user);
        setStatus("authenticated");
      } catch (e) {
        setStatus("unauthenticated");
        setUser(null);
        setToken(null);
        setErrorMessage(e instanceof ApiError ? e.bodyText || e.message : e instanceof Error ? e.message : "Registration failed");
      }
    },
    [apiBaseUrl, tokenProvider]
  );

  const logout = useCallback(async () => {
    await tokenProvider.setToken(null);
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, [tokenProvider]);

  const value: AuthContextValue = {
    status,
    user,
    token,
    apiBaseUrlMissing,
    errorMessage,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
