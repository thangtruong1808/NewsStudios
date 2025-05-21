"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";

interface EmailFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
}

export default function EmailField({ register, errors }: EmailFieldProps) {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium">
        Email Address <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        id="email"
        {...register("email")}
        placeholder="Enter email address"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
      />
      {errors.email && (
        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
      )}
    </div>
  );
}
