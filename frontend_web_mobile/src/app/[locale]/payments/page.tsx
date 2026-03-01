"use client";

import React, { useMemo, useState } from "react";

import { ApiNotice } from "@/components/module/ApiNotice";
import { createBrowserApiClient } from "@/lib/api";
import { ApiError } from "@/lib/api/client";

export default function PaymentsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);

  const [referenceType, setReferenceType] = useState("application");
  const [referenceId, setReferenceId] = useState("app_stub_001");
  const [amountPaise, setAmountPaise] = useState(10000);
  const [currency, setCurrency] = useState("INR");
  const [returnUrl, setReturnUrl] = useState("");

  const [state, setState] = useState<"idle" | "loading">("idle");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-600">Initialize a payment (gateway stub).</p>
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
              const res = await api.requestJson("/payments/init", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  reference_type: referenceType,
                  reference_id: referenceId,
                  amount_paise: Number(amountPaise),
                  currency,
                  return_url: returnUrl || null,
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Reference type</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={referenceType}
                onChange={(e) => setReferenceType(e.target.value)}
                required
              />
            </label>

            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Reference id</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                required
              />
            </label>

            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Amount (paise)</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={amountPaise}
                onChange={(e) => setAmountPaise(Number(e.target.value))}
                type="number"
                min={0}
                required
              />
            </label>

            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Currency</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
            </label>

            <label className="block space-y-1 sm:col-span-2">
              <div className="text-xs font-medium text-slate-600">Return URL (optional)</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={returnUrl}
                onChange={(e) => setReturnUrl(e.target.value)}
                placeholder="https://your-portal.example/return"
              />
            </label>
          </div>

          <button
            type="submit"
            className="focus-ring rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-700 disabled:opacity-60"
            disabled={state === "loading" || !api}
          >
            {state === "loading" ? "Initializing…" : "Initialize payment"}
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
