import Link from "next/link";

import type { Locale } from "@/i18n/config";
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
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-200" />
            <div>
              <div className="text-sm font-semibold leading-5">{t("app.name")}</div>
              <div className="text-xs text-slate-500">{t("app.tagline")}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              className={cn(
                "rounded-md px-3 py-1.5 text-sm ring-1 ring-slate-200 hover:bg-slate-50",
                { "bg-slate-100": locale === "en" }
              )}
              href={`/en${activePath.replace(/^\/(en|hi)/, "")}`}
            >
              EN
            </Link>
            <Link
              className={cn(
                "rounded-md px-3 py-1.5 text-sm ring-1 ring-slate-200 hover:bg-slate-50",
                { "bg-slate-100": locale === "hi" }
              )}
              href={`/hi${activePath.replace(/^\/(en|hi)/, "")}`}
            >
              HI
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-[72px] md:h-[calc(100dvh-72px)]">
          <nav className="rounded-xl border border-slate-200 bg-white p-2">
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
                        "block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                        { "bg-blue-50 text-blue-700 ring-1 ring-blue-100": active }
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
