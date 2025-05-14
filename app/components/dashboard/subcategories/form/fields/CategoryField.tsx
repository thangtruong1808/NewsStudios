"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SubcategoryFormData } from "../subcategorySchema";
import { Category } from "@/app/lib/definition";

interface CategoryFieldProps {
  register: UseFormRegister<SubcategoryFormData>;
  errors: FieldErrors<SubcategoryFormData>;
  categories: Category[];
}

export default function CategoryField({
  register,
  errors,
  categories,
}: CategoryFieldProps) {
  return (
    <div>
      <label
        htmlFor="category_id"
        className="block text-sm font-medium text-gray-700"
      >
        Category <span className="text-red-500">*</span>
      </label>
      <select
        id="category_id"
        {...register("category_id", { valueAsNumber: true })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {errors.category_id && (
        <p className="mt-1 text-sm text-red-600">
          {errors.category_id.message}
        </p>
      )}
    </div>
  );
}
