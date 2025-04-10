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
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`block w-full rounded-md border ${
            error ? "border-red-300" : "border-gray-300"
          } pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm px-4 py-2`}
          placeholder={placeholder}
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
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
