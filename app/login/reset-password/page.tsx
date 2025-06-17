"use client";


import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

/**
 * ResetPasswordPage Component
 * Main reset password page component that handles password reset requests.
 * Features:
 * - Email-based password reset
 * - Form validation
 * - Error handling
 * - Responsive layout with gradient styling
 */
export default function ResetPasswordPage() {

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl">
        {/* Header section with blue background */}
        <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-400 mb-3 py-12 rounded-t-2xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-2xl" />

          {/* Content container */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Reset Password
              </h1>
              <p className="text-blue-100">
                Enter your email to reset your password
              </p>
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

        {/* Reset password form with suspense boundary */}
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </>
  );
}
