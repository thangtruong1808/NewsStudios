"use client";

import { Category } from "@/app/lib/definition";
import { TrashIcon } from "@heroicons/react/24/outline";

interface MobileCategoryCardProps {
  category: Category;
  onDelete: (_payload: { item: Category }) => void;
}

// Description: Render mobile-friendly category card with quick actions.
// Data created: 2024-11-13
// Author: thangtruong
export default function MobileCategoryCard({
  category,
  onDelete,
}: MobileCategoryCardProps) {
  return (
    <div className="mb-4 w-full rounded-md bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {category.name.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500">ID: {category.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete({ item: category })}
            className="rounded-md border border-red-500 p-2 text-red-500 hover:bg-red-50"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-xs text-gray-500">Description</p>
          <p className="text-sm font-medium text-gray-900">
            {category.description || "No description"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Created At</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(category.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Updated At</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(category.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
