"use client";

import {
  UseFormRegister,
  FieldErrors,
  Control,
  useWatch,
} from "react-hook-form";
import { ArticleFormData } from "../articleSchema";

interface BasicFieldsProps {
  register: UseFormRegister<ArticleFormData>;
  errors: FieldErrors<ArticleFormData>;
  control: Control<ArticleFormData>;
  categories: { id: number; name: string; description?: string }[];
  authors: { id: number; name: string }[];
  users: { id: number; firstname: string; lastname: string }[];
  subcategories: { id: number; name: string; category_id: number }[];
  selectedCategory: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  filteredSubcategories: { id: number; name: string; category_id: number }[];
}

export default function BasicFields({
  register,
  errors,
  control,
  categories,
  authors,
  users,
  subcategories,
  selectedCategory,
  onCategoryChange,
  filteredSubcategories,
}: BasicFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category_id")}
            onChange={onCategoryChange}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <select
            {...register("sub_category_id")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
            disabled={!selectedCategory}
          >
            <option value="">Select a subcategory</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          {!selectedCategory && (
            <p className="mt-1 text-sm text-gray-500">
              Please select a category first to enable subcategory selection
            </p>
          )}
          {errors.sub_category_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.sub_category_id.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author <span className="text-red-500">*</span>
          </label>
          <select
            {...register("author_id")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          >
            <option value="">Select an author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          {errors.author_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.author_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            User <span className="text-red-500">*</span>
          </label>
          <select
            {...register("user_id")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} {user.lastname}
              </option>
            ))}
          </select>
          {errors.user_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.user_id.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
