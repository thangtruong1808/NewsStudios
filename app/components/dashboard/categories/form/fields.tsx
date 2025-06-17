"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CategoryFormData } from "../../../../lib/validations/categorySchema";

interface FieldProps {
  register: UseFormRegister<CategoryFormData>;
  errors: FieldErrors<CategoryFormData>;
}

export function NameField({ register, errors }: FieldProps) {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name <span className="text-xs">(*)</span>
      </label>
      <input
        type="text"
        id="name"
        {...register("name")}
        placeholder="Enter category name"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
      )}
    </div>
  );
}

export function DescriptionField({ register, errors }: FieldProps) {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        Description <span className="text-xs">(optional)</span>
      </label>
      <textarea
        id="description"
        {...register("description")}
        placeholder="Enter category description"
        rows={8}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
      )}
    </div>
  );
} 