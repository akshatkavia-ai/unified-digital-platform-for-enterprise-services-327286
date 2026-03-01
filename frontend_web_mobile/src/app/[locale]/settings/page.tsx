"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";

import { ApiNotice } from "@/components/module/ApiNotice";
import { createBrowserApiClient } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";

export default function SettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale || "en";
  const api = useMemo(() => createBrowserApiClient(), []);
  const { user, status, refresh } = useAuth();

  const [state, setState] = useState<"idle" | "loading">("idle");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">Session info and security actions (MFA enroll is a stub).</p>
      </header>

      <ApiNotice />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Profile</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div>
              <span className="font-medium text-slate-600">Status:</span> {status}
            </div>
            <div>
              <span className="font-medium text-slate-600">User ID:</span>{" "}
              <span className="font-mono">{user?.user_id ?? "—"}</span>
            </div>
          </div>

          <button
            type="button"
            className="focus-ring mt-4 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            onClick={() => refresh()}
          >
            Refresh session
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Security</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enroll MFA to require an MFA code during login (scaffolding in backend).
          </p>

          <button
            type="button"
            className="focus-ring mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-700 disabled:opacity-60"
            disabled={state === "loading" || !api}
            onClick={async () => {
              if (!api) return;
              setState("loading");
              setError(null);
              setResult(null);
              try {
                const res = await api.requestJson("/auth/mfa/enroll", { method: "POST" });
                setResult(res);
              } catch (err) {
                const msg =
                  err instanceof ApiError ? `${err.message}\n${err.bodyText}` : err instanceof Error ? err.message : "Error";
                setError(msg);
              } finally {
                setState("idle");
              }
            }}
          >
            {state === "loading" ? "Enrolling…" : "Enroll MFA (stub)"}
          </button>

          <div className="mt-4">
            <Link className="text-sm font-medium text-blue-700 hover:text-blue-800" href={`/${locale}/payments`}>
              Go to Payments →
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <pre className="overflow-auto rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</pre>
      )}

      {result && (
        <pre className="overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
