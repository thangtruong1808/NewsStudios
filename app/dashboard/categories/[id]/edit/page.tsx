"use client";

import { useParams } from "next/navigation";
import CategoryForm from "@/components/dashboard/categories/CategoryForm";

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id;

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Edit Category</h1>
      </div>
      <CategoryForm categoryId={categoryId as string} />
    </div>
  );
}
