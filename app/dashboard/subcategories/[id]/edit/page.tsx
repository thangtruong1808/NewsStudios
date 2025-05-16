"use client";

import { useEffect, useState } from "react";
import SubcategoryForm from "../../../../components/dashboard/subcategories/form/SubcategoryForm";
import { getSubcategoryById } from "@/app/lib/actions/subcategories";
import { SubCategory } from "@/app/lib/definition";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

export default function EditSubcategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);

  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const result = await getSubcategoryById(parseInt(params.id));
        if (result.error || !result.data) {
          setError("Subcategory not found");
          return;
        }
        setSubcategory(result.data);
      } catch (error) {
        console.error("Error fetching subcategory:", error);
        setError("Failed to fetch subcategory data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategory();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <FormSkeleton
              fields={3} // Number of fields in the subcategory form: name, description, category
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

  if (!subcategory) {
    return null;
  }

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
