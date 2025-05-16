"use client";

import React from "react";

interface FormSkeletonProps {
  fields?: number;
  showHeader?: boolean;
  showActions?: boolean;
}

/**
 * FormSkeleton Component
 * A loading skeleton for forms that mimics the structure of edit forms
 * Features:
 * - Configurable number of fields
 * - Optional header and action buttons
 * - Realistic form field widths and spacing
 * - Animated loading effect
 */
export default function FormSkeleton({
  fields = 3,
  showHeader = true,
  showActions = true,
}: FormSkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Form header skeleton */}
      {showHeader && (
        <div className="px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300">
          <div className="h-6 w-48 bg-gray-300 rounded"></div>
        </div>
      )}

      {/* Form content skeleton */}
      <div className="p-6 space-y-6">
        {/* Required fields note skeleton */}
        <div className="h-4 w-64 bg-gray-200 rounded"></div>

        {/* Form fields skeleton */}
        <div className="space-y-6">
          {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="space-y-2">
              {/* Label skeleton */}
              <div className="h-4 w-32 bg-gray-200 rounded"></div>

              {/* Input field skeleton */}
              <div className="h-10 w-full bg-gray-200 rounded"></div>

              {/* Error message skeleton (optional) */}
              {index === 0 && (
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              )}
            </div>
          ))}
        </div>

        {/* Form actions skeleton */}
        {showActions && (
          <div className="flex justify-end space-x-3 pt-4">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * FormFieldSkeleton Component
 * A reusable skeleton for individual form fields
 * Can be used to create custom form layouts
 */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

/**
 * FormHeaderSkeleton Component
 * A reusable skeleton for form headers
 * Can be used to create custom form layouts
 */
export function FormHeaderSkeleton() {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300">
      <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
}

/**
 * FormActionsSkeleton Component
 * A reusable skeleton for form action buttons
 * Can be used to create custom form layouts
 */
export function FormActionsSkeleton() {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}
