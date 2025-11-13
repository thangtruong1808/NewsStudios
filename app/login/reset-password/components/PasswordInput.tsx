"use client";

import React, { useState, forwardRef } from "react";
import FormInput from "./FormInput";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Component Info
// Description: Password field wrapper with visibility toggle for reset password forms.
// Data created: Forward-ref input supporting react-hook-form integration.
// Author: thangtruong

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <FormInput
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          label={label}
          error={error}
          className={className}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
