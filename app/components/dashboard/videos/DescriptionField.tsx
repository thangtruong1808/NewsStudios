"use client";

import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DescriptionField({
  value,
  onChange,
  error,
}: DescriptionFieldProps) {
  return (
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Description (Optional)
      </label>
      <textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter a description for the video"
      />
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-500">
          <ExclamationCircleIcon className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
