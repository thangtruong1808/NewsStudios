"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CategoryForm from "../../../../components/dashboard/categories/CategoryForm";
import { getCategoryById } from "@/app/lib/actions/categories";
import { Category } from "@/app/lib/definition";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";
import { FolderIcon } from "@heroicons/react/24/outline";

export default function EditCategoryPageClient() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await getCategoryById(parseInt(params.id as string));
        if (result.error || !result.data) {
          setError("Category not found");
          return;
        }
        setCategory(result.data);
      } catch {
        setError("Failed to fetch category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="w-full">
        <FormSkeleton
          fields={2} // Number of fields in the category form: name, description
          showHeader={true}
          showActions={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!category) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Form header with gradient background */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FolderIcon className="h-8 w-8" />
            Edit Category
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Update the category's information below.
          </p>
        </div>

        {/* Main form content */}
        <div className="p-4 sm:p-6 space-y-6">
          <p className="text-xs">
            Fields marked with an asterisk (*) are required
          </p>

          <CategoryForm category={category} isEditMode={true} />
        </div>
      </div>
    </div>
  );
} 