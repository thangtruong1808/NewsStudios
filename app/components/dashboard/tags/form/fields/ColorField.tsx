"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TagFormValues } from "../../types";

interface ColorFieldProps {
  register: UseFormRegister<TagFormValues>;
  errors: FieldErrors<TagFormValues>;
}

export default function ColorField({ register, errors }: ColorFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Color</label>
      <div className="mt-1 flex items-center space-x-2">
        <input
          type="color"
          {...register("color")}
          className="h-8 w-8 rounded border border-gray-300"
        />
        <input
          type="text"
          {...register("color")}
          placeholder="#000000"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 text-sm"
        />
      </div>
      {errors.color && (
        <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
      )}
    </div>
  );
}
