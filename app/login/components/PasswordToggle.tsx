"use client";

import React from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordToggleProps {
  showPassword: boolean;
  togglePassword: () => void;
}

export default function PasswordToggle({
  showPassword,
  togglePassword,
}: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={togglePassword}
      className="text-gray-400 hover:text-gray-500 focus:outline-none"
    >
      {showPassword ? (
        <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <EyeIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
