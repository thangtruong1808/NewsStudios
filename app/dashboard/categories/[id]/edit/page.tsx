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
    <div className="w-full">
      <CategoryForm categoryId={params.id} />
    </div>
  );
}
