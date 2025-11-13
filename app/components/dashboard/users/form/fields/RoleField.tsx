"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";

/* eslint-disable no-unused-vars */
interface RoleFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
}
/* eslint-enable no-unused-vars */

// Description: Render role selection dropdown for user access control assignment.
// Data created: 2024-11-13
// Author: thangtruong

export default function RoleField({ register, errors }: RoleFieldProps) {
  return (
    <div>
      <label htmlFor="role" className="block text-sm font-medium">
        Role <span className="text-xs">(*)</span>
      </label>
      <select
        id="role"
        {...register("role")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Select a role
        </option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="user">User</option>
      </select>
      {errors.role && (
        <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
      )}
    </div>
  );
}
