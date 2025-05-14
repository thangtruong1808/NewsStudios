"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubcategoryForm from "@/app/components/dashboard/subcategories/form/SubcategoryForm";
import { getSubcategoryById } from "@/app/lib/actions/subcategories";
import { SubCategory } from "@/app/lib/definition";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function EditSubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const subcategoryId = params.id as string;
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategory = async () => {
      // Validate that the ID is a valid number
      const id = parseInt(subcategoryId, 10);
      if (isNaN(id)) {
        setError("Invalid subcategory ID");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await getSubcategoryById(id);
        if (error) {
          setError(error);
        } else if (data) {
          setSubcategory(data);
        } else {
          setError("Subcategory not found");
        }
      } catch (err) {
        setError("Failed to load subcategory");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategory();
  }, [subcategoryId]);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading subcategory
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/subcategories"
                  className="inline-flex items-center text-sm font-medium text-red-700 hover:text-red-600"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Subcategories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/dashboard/subcategories"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Subcategories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Subcategory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the details of this subcategory.
        </p>
      </div>
      <SubcategoryForm subcategoryId={subcategoryId} />
    </div>
  );
}
