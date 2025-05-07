"use client";

import React from "react";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
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
