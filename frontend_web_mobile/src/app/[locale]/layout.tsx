import type { Metadata } from "next";

import { PortalShell } from "@/components/portal/PortalShell";
import { DEFAULT_LOCALE, isLocale, type Locale, SUPPORTED_LOCALES } from "@/i18n/config";
import { createT, getDictionary } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Unified Digital Platform",
  description: "Unified portal UI shell with modular pages, i18n scaffolding, and API client setup.",
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const dict = await getDictionary(locale);
  const t = createT(dict);

  // Static-export friendly: do not call next/headers() in layouts.
  // We default highlight to the locale home link.
  const activePath = `/${locale}`;

  return (
    <PortalShell locale={locale} t={t} activePath={activePath}>
      {children}
    </PortalShell>
  );
}
