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

/**
 * LoginPage Component
 * Main login page component that handles user authentication and session management.
 * Features:
 * - User authentication with email/password
 * - Session state management
 * - Responsive layout with gradient styling
 * - Form validation and error handling
 */
export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [_isLoading, setIsLoading] = useState(false);

  // Only log session data in development
  if (process.env.NODE_ENV === 'development') {
    console.log("Login Page - Session Status:", status);
    console.log("Login Page - Session Data:", session);
  }

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <LoginSkeleton />;
  }

  /**
   * Handles form submission for user authentication
   * Processes login credentials and manages user session
   */
  const _handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Attempting login with:", { email });
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log("Login Result:", result);
      }

      if (result?.error) {
        toast.error("Invalid credentials");
        return;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Login error:", error);
      }
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl">
        {/* Header section with blue background */}
        <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-400 mb-3 py-8 rounded-t-2xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-2xl" />

          {/* Content container */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-blue-100">Sign in to access your dashboard</p>
            </div>
          </div>
        </div>

        {/* Welcome section with logo and title */}
        <div className="flex items-center justify-center h-16">
          <Link href="/" className="group">
            <Logo />
          </Link>
        </div>

        {/* Login form with suspense boundary */}
        <Suspense fallback={<LoginSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
