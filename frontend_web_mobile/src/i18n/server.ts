import "server-only";

import type { Locale } from "./config";

/**
 * A minimal translation dictionary type.
 * We keep this intentionally loose while still being usable.
 */
export type Dictionary = Record<string, unknown>;

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
  hi: () => import("./dictionaries/hi.json").then((m) => m.default as Dictionary),
} satisfies Record<Locale, () => Promise<Dictionary>>;

/**
 * PUBLIC_INTERFACE
 * Load dictionary for a locale (server-only).
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

/**
 * PUBLIC_INTERFACE
 * Creates a very small "t" function for nested key lookup.
 * If key is missing, it returns the key itself.
 */
export function createT(dict: Dictionary) {
  return (key: string): string => {
    const parts = key.split(".");
    let cur: unknown = dict;
    for (const p of parts) {
      if (typeof cur !== "object" || cur === null) return key;
      cur = (cur as Record<string, unknown>)[p];
    }
    return typeof cur === "string" ? cur : key;
  };
}
