"use client";

import CategoryForm from "@/components/dashboard/categories/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Category
        </h1>
      </div>
      <CategoryForm />
    </div>
  );
}
