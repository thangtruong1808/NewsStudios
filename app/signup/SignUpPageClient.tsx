"use client";

import Link from "next/link";
import Logo from "@/app/components/front-end/shared/Logo";
import SignUpForm from "./SignUpForm";

// Component Info
// Description: Client-side sign-up shell presenting value props alongside the registration form.
// Data created: Layout structure for sign-up storytelling and form entry.
// Author: thangtruong

export default function SignUpPageClient() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100">
      {/* Decorative backdrop */}
      <div className="pointer-events-none absolute inset-0 select-none opacity-40 [background-image:radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.18),transparent_55%)]" />

      {/* Page container */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10 lg:px-12 xl:px-16">
        {/* Story + form grid */}
        <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(480px,620px)] lg:gap-14 xl:gap-16">
          {/* Storytelling panel */}
          <div className="w-full lg:max-w-[660px]">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-200">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
              Join the newsroom collective
            </div>

            <div className="mt-6 space-y-5 text-slate-800">
              <h2 className="text-2xl font-bold tracking-tight sm:text-2xl lg:text-2xl">
                Create your NewsStudios account
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                Build your editorial profile, collaborate with teammates, and elevate the stories that matter. Your personalized newsroom is just a few steps away.
              </p>
            </div>

            <dl className="mt-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-xl bg-white/85 p-4 shadow-sm ring-1 ring-slate-200">
                <dt className="font-semibold text-slate-800">Publish confidently</dt>
                <dd className="mt-1">Manage article pipelines with built-in workflows, reviews, and tagging controls.</dd>
              </div>
              <div className="rounded-xl bg-white/85 p-4 shadow-sm ring-1 ring-slate-200">
                <dt className="font-semibold text-slate-800">Collaborate in sync</dt>
                <dd className="mt-1">Assign writers, editors, and producers with clear accountability across desks.</dd>
              </div>
            </dl>

            <p className="mt-10 text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Return to login
              </Link>
            </p>
          </div>

          {/* Sign-up form card */}
          <div className="w-full max-w-4xl">
            <div className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/60">
              {/* Card header */}
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-8 text-center text-white">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 shadow-inner">
                  <Link href="/" aria-label="NewsStudios home" className="inline-flex items-center justify-center">
                    <Logo />
                  </Link>
                </div>
                <h2 className="mt-6 text-2xl font-semibold">Start your NewsStudios journey</h2>
                <p className="mt-2 text-sm text-blue-100">
                  Set up your newsroom identity and collaborate with your team in minutes.
                </p>
              </div>

              {/* Form wrapper */}
              <div className="px-6 pb-8 pt-6">
                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
