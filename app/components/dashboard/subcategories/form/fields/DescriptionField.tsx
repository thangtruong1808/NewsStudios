"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SubcategoryFormData } from "../subcategorySchema";

interface DescriptionFieldProps {
  register: UseFormRegister<SubcategoryFormData>;
  errors: FieldErrors<SubcategoryFormData>;
  placeholder?: string;
}

export default function DescriptionField({
  register,
  errors,
  placeholder,
}: DescriptionFieldProps) {
  return (
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700"
      >
        Description
      </label>
      <div className="mt-1">
        <textarea
          id="description"
          rows={8}
          {...register("description")}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
}
