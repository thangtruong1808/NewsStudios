"use client";

import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          className={`block w-full rounded-lg border ${error ? "border-red-300" : "border-gray-200"
            } px-3 py-2.5 text-gray-900 placeholder-gray-400 
          focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 
          transition-colors duration-200 ease-in-out
          ${error ? "bg-red-50" : "bg-white"} ${className}`}
        />
        {error && (
          <p
            className="mt-1 text-sm text-red-600 animate-fade-in"
            id={`${props.id}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
