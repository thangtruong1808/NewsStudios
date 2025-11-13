"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";

/* eslint-disable no-unused-vars */
interface DescriptionFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
}
/* eslint-enable no-unused-vars */

// Description: Render optional user description textarea within admin user form.
// Data created: 2024-11-13
// Author: thangtruong

export default function DescriptionField({
  register,
  errors,
}: DescriptionFieldProps) {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium">
        Description <span className="text-xs ">(optional)</span>
      </label>
      <textarea
        id="description"
        rows={8}
        {...register("description")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
        placeholder="Enter a description for this user"
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-600">
          {errors.description.message}
        </p>
      )}
    </div>
  );
}
