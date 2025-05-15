"use client";

import CategoryForm from "../../../components/dashboard/categories/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}
