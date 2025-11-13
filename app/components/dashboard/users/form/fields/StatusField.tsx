"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";

/* eslint-disable no-unused-vars */
interface StatusFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
}
/* eslint-enable no-unused-vars */

// Description: Render status selection dropdown for enabling or disabling user accounts.
// Data created: 2024-11-13
// Author: thangtruong

export default function StatusField({ register, errors }: StatusFieldProps) {
  return (
    <div>
      <label htmlFor="status" className="block text-sm font-medium">
        Status <span className="text-xs">(*)</span>
      </label>
      <select
        id="status"
        {...register("status")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm "
      >
        <option value="" disabled>
          Select status
        </option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {errors.status && (
        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
      )}
    </div>
  );
}
