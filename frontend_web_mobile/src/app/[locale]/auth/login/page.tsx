"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { cn } from "@/lib/ui/cn";
import { useAuth } from "@/lib/auth/context";

export default function LoginPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale || "en";
  const router = useRouter();
  const { login, status, errorMessage, apiBaseUrlMissing } = useAuth();

  const disabled = status === "loading";
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [mfaCode, setMfaCode] = useState("");

  const canSubmit = useMemo(() => email.trim() && password.trim(), [email, password]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="text-sm text-slate-600">
          Authenticate to access Applications, Workflow Tasks, Documents, Inspections, Tickets, and Payments.
        </p>
      </header>

      {apiBaseUrlMissing && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">Backend API not configured</div>
          <div className="mt-1 text-amber-800">
            Set{" "}
            <code className="rounded bg-white px-1.5 py-0.5 ring-1 ring-amber-200">
              NEXT_PUBLIC_API_BASE_URL
            </code>{" "}
            to enable auth and module actions.
          </div>
        </div>
      )}

      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!canSubmit) return;
          await login({ email, password, mfaCode: mfaCode.trim() || undefined });
          router.replace(`/${locale}`);
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <div className="text-sm font-medium text-slate-700">Email</div>
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              required
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <div className="text-sm font-medium text-slate-700">Password</div>
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700">MFA code (optional)</div>
              <div className="text-xs text-slate-500">Only required if MFA enabled</div>
            </div>
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              inputMode="numeric"
              placeholder="123456"
            />
          </label>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={disabled || !canSubmit}
            className={cn(
              "focus-ring inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition",
              {
                "opacity-60": disabled || !canSubmit,
                "hover:from-blue-700 hover:to-cyan-700": !disabled && canSubmit,
              }
            )}
          >
            {disabled ? "Signing in…" : "Sign in"}
          </button>

          <Link
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
            href={`/${locale}/auth/register`}
          >
            Create an account →
          </Link>
        </div>
      </form>
    </section>
  );
}
