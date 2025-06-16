"use client";

import { TagFormValues } from "../../types";
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

interface ColorFieldProps {
  register: UseFormRegister<TagFormValues>;
  errors: FieldErrors<TagFormValues>;
  setValue: UseFormSetValue<TagFormValues>;
}

export default function ColorField({ register, errors, setValue }: ColorFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="color"
        className="block text-sm font-medium text-gray-700"
      >
        Color
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          id="color"
          className="h-10 w-20 rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          {...register("color", {
            required: "Color is required",
          })}
          onChange={(e) => {
            setValue("color", e.target.value);
          }}
        />
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="#000000"
          {...register("color", {
            required: "Color is required",
            pattern: {
              value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
              message: "Please enter a valid hex color code",
            },
          })}
        />
      </div>
      {errors.color && (
        <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
      )}
    </div>
  );
}
