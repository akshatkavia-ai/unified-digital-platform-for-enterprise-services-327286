"use client";

import { useEffect, useMemo, useState } from "react";

import { createBrowserApiClient } from "@/lib/api";

type HealthState =
  | { status: "idle" | "loading" }
  | { status: "success"; data: unknown }
  | { status: "error"; message: string };

export default function HealthPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [state, setState] = useState<HealthState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!api) {
        setState({
          status: "error",
          message: "Missing env var: NEXT_PUBLIC_API_BASE_URL",
        });
        return;
      }

      setState({ status: "loading" });
      try {
        const data = await api.healthCheck();
        if (cancelled) return;
        setState({ status: "success", data });
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "Unknown error";
        setState({ status: "error", message });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [api]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Health</h1>
        <p className="mt-1 text-sm text-slate-600">
          Calls <code className="rounded bg-slate-100 px-1.5 py-0.5">GET /</code> on the backend API.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        {state.status === "loading" && <p className="text-sm text-slate-700">Loading…</p>}
        {state.status === "error" && (
          <div className="space-y-2">
            <p className="text-sm text-red-700">Error: {state.message}</p>
            <p className="text-sm text-slate-600">
              Set{" "}
              <code className="rounded bg-white px-1.5 py-0.5 ring-1 ring-slate-200">
                NEXT_PUBLIC_API_BASE_URL
              </code>{" "}
              (see <code className="rounded bg-white px-1.5 py-0.5 ring-1 ring-slate-200">.env.example</code>).
            </p>
          </div>
        )}
        {state.status === "success" && (
          <pre className="overflow-auto rounded-lg bg-white p-3 text-xs text-slate-800 ring-1 ring-slate-200">
            {JSON.stringify(state.data, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}
