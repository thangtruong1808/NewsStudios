"use client";

import Link from "next/link";
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import Logo from "@/app/components/front-end/shared/Logo";

// Component Info
// Description: Reset password entry page featuring brand context and the reset form card.
// Data created: Layout wrappers that present the reset flow within a centered viewport.
// Author: thangtruong

export default function ResetPasswordPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 select-none opacity-40 [background-image:radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(14,116,144,0.14),transparent_55%)]" />

      {/* Page container */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-16 sm:px-10 lg:px-12 xl:px-16">
        <div className="w-full rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/70">
          {/* Card header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-10 text-center text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 shadow-inner">
              <Link href="/" aria-label="NewsStudios home" className="inline-flex items-center justify-center">
                <Logo />
              </Link>
            </div>
            <h1 className="mt-6 text-3xl font-semibold">Reset your password</h1>
            <p className="mt-2 text-sm text-blue-100">Enter your email and create a new secure password for your NewsStudios account.</p>
          </div>

          {/* Form content */}
          <div className="px-6 pb-10 pt-8">
            <Suspense fallback={<div className="text-center text-sm text-slate-500">Loading form...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
