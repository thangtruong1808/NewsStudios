"use client";

import CategoryForm from "@/components/dashboard/categories/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Create New Category</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
