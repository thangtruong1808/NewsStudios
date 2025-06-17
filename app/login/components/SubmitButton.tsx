"use client";

import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface SubmitButtonProps {
  isPending: boolean;
  text?: {
    default: string;
    pending: string;
  };
}

export default function SubmitButton({
  isPending,
  text = {
    default: "Sign in",
    pending: "Signing in...",
  },
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isPending ? "opacity-75 cursor-not-allowed" : ""
        }`}
    >
      <div className="flex items-center">
        {isPending ? (
          <>
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
            {text.pending}
          </>
        ) : (
          <>
            <span className="mr-2">
              <ArrowRightIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            {text.default}
          </>
        )}
      </div>
    </button>
  );
}
