"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
import Logo from "@/app/components/front-end/shared/Logo";
import LoginSkeleton from "./LoginSkeleton";
import SignUpCTA from "./SignUpCTA";

// Component Info
// Description: Client login experience with session guard, form handling, and supporting CTAs.
// Data created: Login form state, authentication redirects, and session-driven UI.
// Author: thangtruong

export default function LoginPageClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [_isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <LoginSkeleton />;
  }

  const _handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
        return;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 py-14">
      {/* Background overlays */}
      <div className="pointer-events-none absolute inset-0 select-none opacity-40 [background-image:radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(14,116,144,0.12),transparent_55%)]" />

      {/* Page container */}
      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-12 xl:px-16">
        {/* Hero + form grid */}
        <div className="flex flex-col-reverse items-center gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-16">
          {/* Hero storytelling column */}
          <div className="w-full lg:max-w-[620px]">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
              Secure Access Portal
            </div>

            <div className="mt-6 space-y-4 text-slate-800">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Sign in to craft your newsroom
              </h1>
              <p className="text-lg leading-relaxed text-slate-600">
                Manage headline priorities, collaborate with editors, and keep audiences engaged—all from a workspace designed for modern newsrooms.
              </p>
            </div>

            <dl className="mt-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200">
                <dt className="font-semibold text-slate-800">Curate smarter</dt>
                <dd className="mt-1">Prioritize stories, schedules, and multimedia assets with a streamlined dashboard.</dd>
              </div>
              <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200">
                <dt className="font-semibold text-slate-800">Work together</dt>
                <dd className="mt-1">Collaborate with editors and contributors in real time, wherever your team is located.</dd>
              </div>
            </dl>


          </div>

          {/* Authentication card */}
          <div className="w-full max-w-xl">
            <div className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/60">
              {/* Card header */}
              <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-8 text-center text-white">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 shadow-inner">
                  <Link href="/" aria-label="NewsStudios home" className="inline-flex items-center justify-center">
                    <Logo />
                  </Link>
                </div>
                <h2 className="mt-6 text-2xl font-semibold">Welcome back to NewsStudios</h2>
                <p className="mt-2 text-sm text-blue-100">
                  Sign in with your newsroom credentials to continue where you left off.
                </p>
              </div>

              {/* Login form and CTA */}
              <div className="px-6 pb-8 pt-6">
                <Suspense fallback={<LoginSkeleton />}>
                  <LoginForm />
                </Suspense>
                {/* Sign up CTA */}
                <SignUpCTA />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 