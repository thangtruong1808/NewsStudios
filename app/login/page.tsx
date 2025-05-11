"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser, user } = useUser();

  // Log initial user state
  console.log("Initial user context state:", user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
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

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-4xl mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center mb-4">
              {/* <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-3">
                <NewspaperIcon className="h-8 w-8 text-indigo-600" />
              </div> */}
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
    </div>
  );
}
