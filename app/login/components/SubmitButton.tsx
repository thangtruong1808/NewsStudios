"use client";

import React from "react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

interface SubmitButtonProps {
  isPending: boolean;
}

export default function SubmitButton({ isPending }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
    >
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <ArrowRightIcon
          className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
          aria-hidden="true"
        />
      </span>
      {isPending ? "Signing in..." : "Sign in"}
    </button>
  );
}
