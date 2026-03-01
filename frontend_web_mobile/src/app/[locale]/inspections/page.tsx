"use client";

import React, { useMemo, useState } from "react";

import { createBrowserApiClient } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { ApiNotice } from "@/components/module/ApiNotice";

export default function InspectionsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [applicationId, setApplicationId] = useState("");
  const [locationText, setLocationText] = useState("Industrial Area, Sector 21");
  const [result, setResult] = useState<unknown>(null);
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Inspections</h1>
        <p className="text-sm text-slate-600">Schedule an inspection (stub) for an application.</p>
      </header>

      <ApiNotice />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!api) return;

            setError(null);
            setResult(null);
            setState("loading");
            try {
              const res = await api.requestJson("/inspections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  application_id: applicationId,
                  location_text: locationText || null,
                  scheduled_at: null,
                }),
              });
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
          <label className="block space-y-1">
            <div className="text-xs font-medium text-slate-600">Application ID</div>
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              placeholder="UUID (from Applications module)"
              required
            />
          </label>

          <label className="block space-y-1">
            <div className="text-xs font-medium text-slate-600">Location text (optional)</div>
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="focus-ring rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-700 hover:to-blue-700 disabled:opacity-60"
            disabled={state === "loading" || !api}
          >
            {state === "loading" ? "Creating…" : "Create inspection"}
          </button>
        </form>
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
