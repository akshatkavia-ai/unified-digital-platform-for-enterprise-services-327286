export const SUPPORTED_LOCALES = ["en", "hi"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * PUBLIC_INTERFACE
 * Type guard that checks whether a string is a supported locale.
 */
export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
