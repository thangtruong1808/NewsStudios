"use client";

import SubcategoryForm from "../../../../components/dashboard/subcategories/form/SubcategoryForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function EditSubcategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <SubcategoryForm subcategoryId={params.id} />
        </div>
      </div>
    </div>
  );
}
