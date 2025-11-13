"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { TagFormValues } from "../../types";

/* eslint-disable no-unused-vars */
interface NameFieldProps {
  register: UseFormRegister<TagFormValues>;
  errors: FieldErrors<TagFormValues>;
}
/* eslint-enable no-unused-vars */

// Description: Render input control for required tag naming field.
// Data created: 2024-11-13
// Author: thangtruong

export default function NameField({ register, errors }: NameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Name <span className="text-xs">(*)</span>
      </label>
      <input
        type="text"
        {...register("name")}
        placeholder="Enter tag name"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 text-sm"
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
      )}
    </div>
  );
}
