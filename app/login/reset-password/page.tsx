"use client";

import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl">
        <div className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-2 py-7 rounded-t-2xl" />

        <div className="text-center mb-8">
          <div className="flex flex-col items-center mb-2">
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
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and new password to reset your account
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </>
  );
}
