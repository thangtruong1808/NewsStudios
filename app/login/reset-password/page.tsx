"use client";

import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { NewspaperIcon } from "@heroicons/react/24/outline";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-lg mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-3">
                <NewspaperIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and new password to reset your account
            </p>
          </div>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
