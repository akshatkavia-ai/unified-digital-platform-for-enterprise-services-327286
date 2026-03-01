"use client";

import React, { useMemo, useState } from "react";

import { ApiNotice } from "@/components/module/ApiNotice";
import { createBrowserApiClient } from "@/lib/api";
import { ApiError } from "@/lib/api/client";

export default function HelpdeskPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [subject, setSubject] = useState("Unable to upload document");
  const [description, setDescription] = useState("The upload button shows an error. Please assist.");
  const [category, setCategory] = useState("documents");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");

  const [state, setState] = useState<"idle" | "loading">("idle");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Helpdesk</h1>
        <p className="text-sm text-slate-600">Create a support ticket (stub).</p>
      </header>

      <ApiNotice />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!api) return;

            setState("loading");
            setError(null);
            setResult(null);
            try {
              const res = await api.requestJson("/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  subject,
                  description,
                  category: category || null,
                  priority,
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
            <div className="text-xs font-medium text-slate-600">Subject</div>
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-1">
            <div className="text-xs font-medium text-slate-600">Description</div>
            <textarea
              className="focus-ring min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Category (optional)</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>

            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Priority</div>
              <select
                className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
              >
                <option value="low">low</option>
                <option value="normal">normal</option>
                <option value="high">high</option>
                <option value="urgent">urgent</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="focus-ring rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            disabled={state === "loading" || !api}
          >
            {state === "loading" ? "Submitting…" : "Create ticket"}
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
