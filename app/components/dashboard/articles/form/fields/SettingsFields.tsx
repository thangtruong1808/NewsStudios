"use client";

import type { UseFormRegister } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";

interface SettingsFieldsProps {
  register: UseFormRegister<ArticleFormData>;
}

// Description: Configure article settings toggles such as featured, trending, and priority.
// Data created: 2024-11-13
// Author: thangtruong
export default function SettingsFields({
  register,
}: SettingsFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Featured toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("is_featured")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="ml-2 block text-sm">Featured Article</label>
      </div>

      {/* Trending toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("is_trending")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="ml-2 block text-sm">Trending Article</label>
      </div>

      {/* Headline priority */}
      <div>
        <label className="block text-sm font-medium">Headline Priority</label>
        <input
          type="number"
          {...register("headline_priority", {
            valueAsNumber: true,
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-2 py-2 text-xs"
        />
      </div>
    </div>
  );
}
