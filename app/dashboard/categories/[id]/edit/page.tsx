"use client";

import { useEffect, useState } from "react";
import CategoryForm from "../../../../components/dashboard/categories/CategoryForm";
import { getCategoryById } from "@/app/lib/actions/categories";
import { Category } from "@/app/lib/definition";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await getCategoryById(parseInt(params.id));
        if (result.error || !result.data) {
          setError("Category not found");
          return;
        }
        setCategory(result.data);
      } catch (error) {
        console.error("Error fetching category:", error);
        setError("Failed to fetch category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <FormSkeleton
              fields={2} // Number of fields in the category form: name, description
              showHeader={true}
              showActions={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

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
