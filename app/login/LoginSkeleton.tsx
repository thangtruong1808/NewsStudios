import React from "react";

export default function LoginSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl">
      {/* Header section with blue background */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-400 mb-3 py-8 rounded-t-2xl overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-2xl" />

        {/* Content container */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-48 bg-white/20 rounded animate-pulse mx-auto mb-2"></div>
            <div className="h-4 w-64 bg-white/20 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Logo section skeleton */}
      <div className="flex items-center justify-center h-16">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Form skeleton */}
      <div className="p-6 space-y-6">
        {/* Email field skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Password field skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Remember me and forgot password skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Login button skeleton */}
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
} 