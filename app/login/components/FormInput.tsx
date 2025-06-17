"use client";

import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

export default function FormInput({
  id,
  name,
  type,
  label,
  value,
  onChange,
  error,
  placeholder,
  icon,
  rightElement,
  autoComplete,
}: FormInputProps) {
  const handleChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // ... existing code ...
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={handleChange}
          className={`block w-full rounded-lg border ${error ? "border-red-300" : "border-gray-300"
            } pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm
          focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 
          transition-all duration-200 ease-in-out
          ${error ? "bg-red-50" : "bg-white"}
          hover:border-gray-400`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p
          className="mt-1 text-sm text-red-600 animate-fade-in"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
