"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SubcategoryFormData } from "../subcategorySchema";

interface DescriptionFieldProps {
  register: UseFormRegister<SubcategoryFormData>;
  errors: FieldErrors<SubcategoryFormData>;
}

export default function DescriptionField({
  register,
  errors,
}: DescriptionFieldProps) {
  return (
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700"
      >
        Description <span className="text-sm text-gray-400">(optional)</span>
      </label>
      <textarea
        id="description"
        {...register("description")}
        rows={3}
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
