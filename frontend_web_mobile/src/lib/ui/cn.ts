export type ClassValue = string | undefined | null | false | Record<string, boolean>;

/**
 * PUBLIC_INTERFACE
 * Minimal className combiner (dependency-free).
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const v of values) {
    if (!v) continue;
    if (typeof v === "string") out.push(v);
    else if (typeof v === "object") {
      for (const [k, enabled] of Object.entries(v)) {
        if (enabled) out.push(k);
      }
    }
  }

  return out.join(" ");
}
