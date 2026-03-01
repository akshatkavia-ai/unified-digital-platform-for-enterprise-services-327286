export type AuthToken = string | null;

export interface AuthTokenProvider {
  /**
   * Returns a bearer token (without the "Bearer " prefix) or null.
   */
  getToken(): Promise<AuthToken> | AuthToken;

  /**
   * Sets a bearer token (without the "Bearer " prefix). Use null to clear.
   */
  setToken(token: AuthToken): Promise<void> | void;
}

const STORAGE_KEY = "udp_auth_token";

/**
 * PUBLIC_INTERFACE
 * Browser token provider using localStorage.
 *
 * Notes:
 * - Safe to import in client components only.
 * - On server it returns null.
 */
export function createBrowserLocalStorageTokenProvider(): AuthTokenProvider {
  return {
    getToken() {
      if (typeof window === "undefined") return null;
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    },
    setToken(token: AuthToken) {
      if (typeof window === "undefined") return;
      try {
        if (!token) window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, token);
      } catch {
        // no-op
      }
    },
  };
}
