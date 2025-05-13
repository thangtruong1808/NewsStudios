"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  isEditMode: boolean;
}

export default function PasswordField({
  register,
  errors,
  isEditMode,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700"
      >
        Password{" "}
        {isEditMode ? (
          <span className="text-gray-500">(leave blank to keep current)</span>
        ) : (
          <span className="text-red-500">*</span>
        )}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          {...register("password")}
          placeholder={isEditMode ? "Enter new password to change" : "Password"}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 pr-10"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
        >
          {showPassword ? (
            <EyeSlashIcon
              className="h-5 w-5 text-gray-400 hover:text-gray-500"
              aria-hidden="true"
            />
          ) : (
            <EyeIcon
              className="h-5 w-5 text-gray-400 hover:text-gray-500"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      {errors.password && (
        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
      )}
    </div>
  );
}
