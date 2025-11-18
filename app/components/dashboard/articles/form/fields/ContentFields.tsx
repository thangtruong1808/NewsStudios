"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";

interface ContentFieldsProps {
  register: UseFormRegister<ArticleFormData>;
  errors: FieldErrors<ArticleFormData>;
}

// Component Info
// Description: Provide article content textarea with validation messaging.
// Date created: 2025-01-27
// Author: thangtruong
export default function ContentFields({
  register,
  errors,
}: ContentFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Body content */}
      <div>
        <label className="block text-sm font-medium">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("content")}
          rows={12}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-xs"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
    </div>
  );
}
