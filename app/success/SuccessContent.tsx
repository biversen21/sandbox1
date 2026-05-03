"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OptimizedResults, { type OptimizedResult } from "@/components/OptimizedResults";

const STORAGE_KEY = "jc_payload";

type Status = "loading" | "success" | "error";

function getStoredPayload(): unknown | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function SuccessContent() {
  const [status, setStatus] = useState<Status>("loading");
  const [result, setResult] = useState<OptimizedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const payload = getStoredPayload();

      if (!payload) {
        setError("No session data found. Please return to the homepage and try again.");
        setStatus("error");
        return;
      }

      try {
        const res = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error ?? "Optimization failed. Please contact support.");
          setStatus("error");
          return;
        }
        setResult(data as OptimizedResult);
        setStatus("success");
      } catch {
        setError("Could not generate your results. Please contact support if this persists.");
        setStatus("error");
      }
    }

    run();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Generating your optimized resume...</p>
          <p className="text-xs text-gray-400 mt-1">This usually takes 15–30 seconds.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <p className="text-gray-800 font-semibold mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm underline underline-offset-2">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            JobCopilot
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-8">
          <svg
            className="w-4 h-4 text-green-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-green-800 font-medium">
            Payment successful — your optimized package is ready below.
          </p>
        </div>

        {result && <OptimizedResults result={result} paid />}
      </div>
    </main>
  );
}
