"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TagFormValues } from "../../../types";

interface DescriptionFieldProps {
  register: UseFormRegister<TagFormValues>;
  errors: FieldErrors<TagFormValues>;
}

export default function DescriptionField({
  register,
  errors,
}: DescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        {...register("description")}
        rows={4}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-600">
          {errors.description.message}
        </p>
      )}
    </div>
  );
}
