"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useUser } from "../context/UserContext";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, user } = useUser();

  console.log("Login Page - Session Status:", status);
  console.log("Login Page - Session Data:", session);

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

      // Set user context with email and role
      const userData = {
        email,
        role: "user", // You might want to get this from your auth response
      };

      console.log("Setting user context with data:", userData);
      setUser(userData);

      // Log user context after setting
      console.log("User context after setting:", userData);

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
        {/* bg color on the top */}
        <div className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-3 py-7 rounded-t-2xl" />
        <div className="text-center mb-8">
          <div className="flex flex-col items-center mb-4">
            <Link
              href="/"
              className="text-4xl font-bold text-stone-500 mt-1 italic"
            >
              <span className="relative inline-flex items-center">
                <span className="text-3xl">D</span>
                <span>aily</span>
                <span className="text-3xl">T</span>
                <span>ech</span>
                <span className="text-3xl">N</span>
                <span>ews</span>
              </span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-stone-500 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
      {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-4xl mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center mb-4">
                <Link
                  href="/"
                  className="text-4xl font-bold text-stone-500 mt-1 italic"
                >
                  <span className="relative inline-flex items-center">
                    <span className="text-3xl">D</span>
                    <span>aily</span>
                    <span className="text-3xl">T</span>
                    <span>ech</span>
                    <span className="text-3xl">N</span>
                    <span>ews</span>
                  </span>
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-stone-500 tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div> */}
    </>
  );
}
