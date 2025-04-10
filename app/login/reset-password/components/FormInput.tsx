"use client";

import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export default function FormInput({
  label,
  error,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        {...props}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
