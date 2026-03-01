import type { AuthTokenProvider } from "@/lib/auth/token";

export type ApiClientConfig = {
  baseUrl: string;
  tokenProvider?: AuthTokenProvider;
  /**
   * Optional extra headers applied to every request.
   * Useful for correlation IDs, etc.
   */
  defaultHeaders?: Record<string, string>;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly bodyText: string;

  constructor(message: string, status: number, bodyText: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

async function buildHeaders(config: ApiClientConfig, extra?: HeadersInit): Promise<HeadersInit> {
  const base: Record<string, string> = {
    Accept: "application/json",
    ...(config.defaultHeaders ?? {}),
  };

  const token = await config.tokenProvider?.getToken();
  if (token) base.Authorization = `Bearer ${token}`;

  // Let caller override base headers if needed.
  return {
    ...base,
    ...(extra as Record<string, string> | undefined),
  };
}

/**
 * PUBLIC_INTERFACE
 * Minimal typed API client for backend_api.
 *
 * As backend grows, add methods here (or generate clients later).
 */
export class ApiClient {
  private readonly config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private url(path: string): string {
    const trimmedBase = this.config.baseUrl.replace(/\/+$/, "");
    const trimmedPath = path.startsWith("/") ? path : `/${path}`;
    return `${trimmedBase}${trimmedPath}`;
  }

  /**
   * PUBLIC_INTERFACE
   * Low-level request helper used by higher-level methods.
   *
   * Notes:
   * - Parses JSON when possible, but falls back to string for non-JSON responses.
   * - Throws ApiError on non-2xx.
   */
  async requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(this.url(path), {
      ...init,
      headers: await buildHeaders(this.config, init?.headers),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      throw new ApiError(`API request failed: ${res.status} ${res.statusText}`, res.status, bodyText);
    }

    // Try JSON parsing; allow empty.
    if (!bodyText) return undefined as T;
    try {
      return JSON.parse(bodyText) as T;
    } catch {
      // If backend returns non-JSON for some endpoints, expose as string.
      return bodyText as T;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Backend health check: GET /
   * Current OpenAPI exposes only this endpoint.
   */
  async healthCheck(): Promise<unknown> {
    return this.requestJson<unknown>("/", { method: "GET" });
  }
}
