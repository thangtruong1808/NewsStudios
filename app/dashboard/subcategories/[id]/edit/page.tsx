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
      <div className="w-full">
        <FormSkeleton
          fields={3} // Number of fields in the subcategory form: name, description, category
          showHeader={true}
          showActions={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!subcategory) {
    return null;
  }

  return (
    <div className="w-full">
      <SubcategoryForm subcategoryId={params.id} />
    </div>
  );
}
