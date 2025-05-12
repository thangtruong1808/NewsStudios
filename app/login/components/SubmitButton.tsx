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
      className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-zinc-600 to-zinc-400 py-3 px-4 text-sm font-medium text-white 
      hover:from-violet-600 hover:to-fuchsia-600 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200 ease-in-out
      shadow-sm hover:shadow-md"
    >
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <ArrowRightIcon
          className="h-5 w-5 text-indigo-200 group-hover:text-indigo-100 transition-colors duration-200"
          aria-hidden="true"
        />
      </span>
      {isPending ? text.pending : text.default}
    </button>
  );
}
