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
  return (
    <div className="space-y-2 w-full max-w-4xl">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`block w-full rounded-lg border ${
            error ? "border-red-300" : "border-gray-200"
          } pl-12 pr-4 py-2.5 text-gray-900 placeholder-gray-400 
          focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 
          transition-colors duration-200 ease-in-out
          ${error ? "bg-red-50" : "bg-white"}`}
          placeholder={placeholder}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
