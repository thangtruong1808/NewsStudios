"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

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
  const [isLoading, setIsLoading] = useState(false);

  console.log("Login Page - Session Status:", status);
  console.log("Login Page - Session Data:", session);

  /**
   * Handles form submission for user authentication
   * Processes login credentials and manages user session
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("Attempting login with:", { email });
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Login Result:", result);

      if (result?.error) {
        toast.error("Invalid credentials");
        return;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center h-16">
            {/* Logo and Brand section with hover effects */}
            <Link href="/" className="flex items-center space-x-3 group">
              {/* Icon container with gradient background and blur effect */}
              <div className="relative">
                {/* Gradient background with hover opacity transition */}
                <div className="absolute inset-0 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative p-2 rounded-lg ">
                  <NewspaperIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              {/* Brand name with blue text color */}
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-500">
                  YourNewsHub
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Login form with suspense boundary */}
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
