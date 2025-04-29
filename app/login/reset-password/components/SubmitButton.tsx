"use client";

import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface SubmitButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function SubmitButton({
  isLoading,
  children,
  className = "",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 px-4 text-sm font-medium text-white 
      hover:from-indigo-700 hover:to-indigo-800 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200 ease-in-out
      shadow-sm hover:shadow-md ${className}`}
    >
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <ArrowRightIcon
          className="h-5 w-5 text-indigo-200 group-hover:text-indigo-100 transition-colors duration-200"
          aria-hidden="true"
        />
      </span>
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
