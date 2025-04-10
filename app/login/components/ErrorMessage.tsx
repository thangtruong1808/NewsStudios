"use client";

import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
        </div>
      </div>
    </div>
  );
}
