import { ApiClient } from "@/lib/api/client";
import { createBrowserLocalStorageTokenProvider } from "@/lib/auth/token";

/**
 * PUBLIC_INTERFACE
 * Creates an API client for use in client components.
 *
 * Notes:
 * - For static export builds, environment variables may be absent in CI.
 * - In that case, this returns null and the UI should render a helpful message.
 */
export function createBrowserApiClient(): ApiClient | null {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return null;

  return new ApiClient({
    baseUrl,
    tokenProvider: createBrowserLocalStorageTokenProvider(),
  });
}
