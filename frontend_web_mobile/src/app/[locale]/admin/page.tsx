"use client";

import React, { useMemo, useState } from "react";

import { ApiNotice } from "@/components/module/ApiNotice";
import { createBrowserApiClient } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";

export default function AdminPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const { user, status } = useAuth();

  const [state, setState] = useState<"idle" | "loading">("idle");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Admin</h1>
        <p className="text-sm text-slate-600">
          Minimal admin/ops view: backend docs help + session diagnostics.
        </p>
      </header>

      <ApiNotice />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Session</div>
        <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <span className="font-medium text-slate-600">Auth status:</span> {status}
          </div>
          <div>
            <span className="font-medium text-slate-600">User ID:</span>{" "}
            <span className="font-mono">{user?.user_id ?? "—"}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="focus-ring rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            disabled={state === "loading" || !api}
            onClick={async () => {
              if (!api) return;
              setState("loading");
              setError(null);
              setResult(null);
              try {
                const res = await api.requestJson("/docs/help", { method: "GET" });
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
            {state === "loading" ? "Loading…" : "Load backend docs help"}
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Note: backend audit logs are written server-side for actions like auth.login, applications.create, etc.
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
