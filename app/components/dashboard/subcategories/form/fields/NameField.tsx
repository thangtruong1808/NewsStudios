"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SubcategoryFormData } from "../subcategorySchema";

interface NameFieldProps {
  register: UseFormRegister<SubcategoryFormData>;
  errors: FieldErrors<SubcategoryFormData>;
}

export default function NameField({ register, errors }: NameFieldProps) {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="name"
        {...register("name")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
      )}
    </div>
  );
}
