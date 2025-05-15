"use client";

import CategoryForm from "../../../../components/dashboard/categories/CategoryForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <CategoryForm categoryId={params.id} />
        </div>
      </div>
    </div>
  );
}
