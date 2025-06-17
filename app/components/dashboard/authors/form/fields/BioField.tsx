"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthorFormData } from "../authorSchema";

interface BioFieldProps {
  register: UseFormRegister<AuthorFormData>;
  errors: FieldErrors<AuthorFormData>;
}

export default function BioField({ register, errors }: BioFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="bio"
        className="block text-sm font-medium text-gray-700"
      >
        Bio
      </label>
      <textarea
        id="bio"
        rows={4}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 py-2"
        placeholder="Enter author's bio"
        {...register("bio", {
          required: "Bio is required",
          minLength: {
            value: 10,
            message: "Bio must be at least 10 characters long",
          },
          maxLength: {
            value: 1000,
            message: "Bio must not exceed 1000 characters",
          },
        })}
      />
      {errors.bio && (
        <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
      )}
    </div>
  );
}
