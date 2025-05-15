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
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center">
        <span className="mr-2">
          <ArrowRightIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
        {isPending ? text.pending : text.default}
      </div>
    </button>
  );
}
