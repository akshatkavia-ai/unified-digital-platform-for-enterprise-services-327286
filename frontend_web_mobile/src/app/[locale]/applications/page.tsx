"use client";

import React, { useMemo, useState } from "react";

import { createBrowserApiClient } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { ApiNotice } from "@/components/module/ApiNotice";

type ApplicationResponse = {
  id: string;
  status: string;
  applicant_name: string;
  service_code: string;
  created_at: string;
};

export default function ApplicationsPage() {
  const api = useMemo(() => createBrowserApiClient(), []);
  const [createState, setCreateState] = useState<"idle" | "loading">("idle");
  const [getState, setGetState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const [applicantName, setApplicantName] = useState("Acme Industries");
  const [serviceCode, setServiceCode] = useState("CONFORMITY_CERT");
  const [payloadJson, setPayloadJson] = useState('{"notes":"Initial submission"}');

  const [applicationId, setApplicationId] = useState("");
  const [result, setResult] = useState<unknown>(null);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
        <p className="text-sm text-slate-600">
          Create and view applications (backend stub persistence + audit log).
        </p>
      </header>

      <ApiNotice />

      {!api && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          API client not available.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Create application</h2>
          <form
            className="mt-3 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!api) return;

              setError(null);
              setCreateState("loading");
              setResult(null);
              try {
                const payload = payloadJson ? JSON.parse(payloadJson) : {};
                const res = await api.requestJson<ApplicationResponse>("/applications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    applicant_name: applicantName,
                    service_code: serviceCode,
                    payload,
                  }),
                });

                setResult(res);
                setApplicationId(res.id);
              } catch (err) {
                const msg =
                  err instanceof ApiError ? `${err.message}\n${err.bodyText}` : err instanceof Error ? err.message : "Error";
                setError(msg);
              } finally {
                setCreateState("idle");
              }
            }}
          >
            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Applicant name</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
              />
            </label>

            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Service code</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={serviceCode}
                onChange={(e) => setServiceCode(e.target.value)}
              />
            </label>

            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Payload (JSON)</div>
              <textarea
                className="focus-ring min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs"
                value={payloadJson}
                onChange={(e) => setPayloadJson(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="focus-ring rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-700 disabled:opacity-60"
              disabled={createState === "loading" || !api}
            >
              {createState === "loading" ? "Creating…" : "Create"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Get application</h2>
          <form
            className="mt-3 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!api || !applicationId.trim()) return;

              setError(null);
              setGetState("loading");
              setResult(null);
              try {
                const res = await api.requestJson<ApplicationResponse>(`/applications/${applicationId.trim()}`, {
                  method: "GET",
                });
                setResult(res);
              } catch (err) {
                const msg =
                  err instanceof ApiError ? `${err.message}\n${err.bodyText}` : err instanceof Error ? err.message : "Error";
                setError(msg);
              } finally {
                setGetState("idle");
              }
            }}
          >
            <label className="block space-y-1">
              <div className="text-xs font-medium text-slate-600">Application ID</div>
              <input
                className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="UUID"
              />
            </label>

            <button
              type="submit"
              className="focus-ring rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
              disabled={getState === "loading" || !api || !applicationId.trim()}
            >
              {getState === "loading" ? "Loading…" : "Fetch"}
            </button>
          </form>
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
