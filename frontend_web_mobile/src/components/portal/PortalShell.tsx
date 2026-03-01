import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/ui/cn";

type NavItem = { href: string; label: string; key: string };

export function PortalShell({
  locale,
  t,
  activePath,
  children,
}: {
  locale: Locale;
  t: (key: string) => string;
  activePath: string;
  children: React.ReactNode;
}) {
  const { status, user, logout } = useAuth();

  const nav: NavItem[] = [
    { href: `/${locale}`, label: t("nav.dashboard"), key: "dashboard" },
    { href: `/${locale}/applications`, label: t("nav.applications"), key: "applications" },
    { href: `/${locale}/inspections`, label: t("nav.inspections"), key: "inspections" },
    { href: `/${locale}/documents`, label: t("nav.documents"), key: "documents" },
    { href: `/${locale}/helpdesk`, label: t("nav.helpdesk"), key: "helpdesk" },
    { href: `/${locale}/admin`, label: t("nav.admin"), key: "admin" },
    { href: `/${locale}/settings`, label: t("nav.settings"), key: "settings" },
  ];

  return (
    <div className="page-bg min-h-dvh text-slate-900">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-slate-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-white" />
              <div className="absolute -left-2 -top-2 h-8 w-8 rounded-full bg-blue-500/15 blur-sm" />
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-cyan-500/15 blur-sm" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-5 tracking-tight">{t("app.name")}</div>
              <div className="text-xs text-slate-500">{t("app.tagline")}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === "authenticated" ? (
              <>
                <div className="hidden rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 sm:block">
                  <span className="font-semibold">User</span>{" "}
                  <span className="font-mono">{user?.user_id?.slice(0, 8) ?? "—"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="focus-ring rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                className="focus-ring rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-slate-50"
                href={`/${locale}/auth/login`}
              >
                Sign in
              </Link>
            )}

            <Link
              className={cn(
                "focus-ring rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-slate-50",
                { "bg-slate-100 text-slate-900": locale === "en" }
              )}
              href={`/en${activePath.replace(/^\/(en|hi)/, "")}`}
              aria-label="Switch language to English"
            >
              EN
            </Link>
            <Link
              className={cn(
                "focus-ring rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-slate-50",
                { "bg-slate-100 text-slate-900": locale === "hi" }
              )}
              href={`/hi${activePath.replace(/^\/(en|hi)/, "")}`}
              aria-label="Switch language to Hindi"
            >
              HI
            </Link>
          </div>
        </div>
      </div>

      {/* Shell grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[272px_1fr]">
        <aside className="md:sticky md:top-[72px] md:h-[calc(100dvh-72px)]">
          <nav className="surface p-2">
            <div className="px-2 pb-2 pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t("nav.dashboard")}
              </div>
            </div>

            <ul className="flex flex-col gap-1">
              {nav.map((item) => {
                const active =
                  activePath === item.href ||
                  (item.href !== `/${locale}` && activePath.startsWith(item.href));

                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={cn(
                        "focus-ring group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900",
                        {
                          "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 ring-1 ring-blue-100":
                            active,
                        }
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="truncate">{item.label}</span>
                      <span
                        className={cn(
                          "ml-3 inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition group-hover:text-slate-600",
                          { "text-blue-600": active }
                        )}
                        aria-hidden="true"
                        title={active ? "Active" : "Navigate"}
                      >
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2">
              <div className="text-xs font-medium text-slate-700">Tip</div>
              <div className="mt-0.5 text-xs text-slate-600">
                Use the sidebar to switch modules.
              </div>
            </div>
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="surface-strong p-5 md:p-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
