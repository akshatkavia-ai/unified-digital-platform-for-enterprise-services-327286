"use client";

import React from "react";

import { useAuth } from "@/lib/auth/context";

export function ApiNotice() {
  const { apiBaseUrlMissing } = useAuth();

  if (!apiBaseUrlMissing) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="font-semibold">Backend API not configured</div>
      <div className="mt-1 text-amber-800">
        Set{" "}
        <code className="rounded bg-white px-1.5 py-0.5 ring-1 ring-amber-200">NEXT_PUBLIC_API_BASE_URL</code>{" "}
        to enable module actions.
      </div>
    </div>
  );
}
