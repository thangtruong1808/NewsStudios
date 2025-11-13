"use client";

import { FolderIcon } from "@heroicons/react/24/outline";
import CategoryForm from "@/app/components/dashboard/categories/CategoryForm";

// Description: Dashboard page wrapper for creating new categories via shared form.
// Data created: 2024-11-13
// Author: thangtruong
export default function CreateCategoryPageClient() {
  return (
    <div className="bg-gray-50">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Form header with gradient background */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FolderIcon className="h-8 w-8" />
            Create New Category
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Fill in the category's information below.
          </p>
        </div>

        {/* Main form content */}
        <div className="p-4 sm:p-6 space-y-6">
          <p className="text-xs">
            Fields marked with an asterisk (*) are required
          </p>

          <CategoryForm isEditMode={false} />
        </div>
      </div>
    </div>
  );
} 