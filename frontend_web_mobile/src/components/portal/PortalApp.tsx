"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";

import { PortalShell } from "@/components/portal/PortalShell";
import type { Locale } from "@/i18n/config";
import { AuthProvider, useAuth } from "@/lib/auth/context";

function Gate({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const { status, apiBaseUrlMissing } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;

  useEffect(() => {
    // Client-side gating to keep static export compatibility.
    if (status !== "unauthenticated") return;

    // Don't redirect if backend URL isn't configured; user should still be able to see a helpful message on /auth.
    if (apiBaseUrlMissing) return;

    const isAuthRoute = pathname.startsWith(`/${locale}/auth`);
    if (!isAuthRoute) router.replace(`/${locale}/auth/login`);
  }, [apiBaseUrlMissing, locale, pathname, router, status]);

  return <>{children}</>;
}

/**
 * PUBLIC_INTERFACE
 * Client-side wrapper that:
 * - Computes activePath via usePathname() (static export safe)
 * - Provides AuthProvider and client-side route gating
 */
export function PortalApp({
  locale,
  t,
  children,
}: {
  locale: Locale;
  t: (key: string) => string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activePath = useMemo(() => pathname ?? `/${locale}`, [locale, pathname]);

  return (
    <AuthProvider>
      <PortalShell locale={locale} t={t} activePath={activePath}>
        <Gate locale={locale}>{children}</Gate>
      </PortalShell>
    </AuthProvider>
  );
}
