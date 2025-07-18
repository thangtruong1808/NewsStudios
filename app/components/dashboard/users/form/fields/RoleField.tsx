"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";

interface RoleFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
}

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
