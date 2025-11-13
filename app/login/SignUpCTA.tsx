"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "lucide-react";

// Component Info
// Description: Sign-up call-to-action shown beneath the login form.
// Data created: Navigational link guiding users to the registration flow.
// Author: thangtruong

export default function SignUpCTA() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigate = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push("/signup");
  };

  return (
    <section className="mt-8 rounded-2xl bg-slate-50 px-6 py-5 text-center shadow-inner ring-1 ring-slate-200/50">
      {/* CTA heading */}
      <h2 className="text-lg font-semibold text-slate-800">New to NewsStudios?</h2>

      {/* CTA description */}
      <p className="mt-2 text-sm text-slate-600">
        Create an account to personalize your dashboard, bookmark articles, and follow topics you care about.
      </p>

      {/* CTA action */}
      <button
        type="button"
        onClick={handleNavigate}
        disabled={isNavigating}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isNavigating ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Redirecting...
          </span>
        ) : (
          <>
            <span>Create your free account</span>
            <ArrowRightCircle className="h-5 w-5" aria-hidden="true" />
          </>
        )}
      </button>
    </section>
  );
}
