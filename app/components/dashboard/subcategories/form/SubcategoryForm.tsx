"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  subcategorySchema,
  type SubcategoryFormData,
} from "./subcategorySchema";
import {
  createSubcategory,
  updateSubcategory,
  getSubcategoryById,
} from "@/app/lib/actions/subcategories";
import { getCategories } from "@/app/lib/actions/categories";
import { Category } from "@/app/lib/definition";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import { FolderIcon } from "@heroicons/react/24/outline";
import { NameField, DescriptionField, CategoryField } from "./fields";

// Component Info
// Description: Form for creating or editing subcategories within the dashboard.
// Data created: React Hook Form state tied to subcategory mutations and category lookup.
// Author: thangtruong

interface SubcategoryFormProps {
  subcategoryId?: string;
}

export default function SubcategoryForm({
  subcategoryId,
}: SubcategoryFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: formIsSubmitting },
    watch,
  } = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategorySchema),
  });

  const formValues = watch();
  const isFormEmpty =
    !formValues.name && !formValues.description && !formValues.category_id;

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories({ limit: 100, sortField: "name", sortDirection: "asc" });
      if (result.error || !result.data) {
        showErrorToast({ message: result.error ?? "Failed to load categories" });
        setCategories([]);
        return;
      }
      setCategories(result.data as Category[]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategory = async () => {
      if (!subcategoryId) return;

      const numericId = Number(subcategoryId);
      if (Number.isNaN(numericId)) {
        setError("Invalid subcategory ID");
        showErrorToast({ message: "Invalid subcategory ID" });
        return;
      }

      const { data, error: fetchError } = await getSubcategoryById(numericId);
      if (fetchError) {
        setError(fetchError);
        showErrorToast({ message: fetchError });
        return;
      }
      if (data) {
        reset({
          name: data.name,
          description: data.description,
          category_id: data.category_id,
        });
      }
    };

    fetchSubcategory();
  }, [subcategoryId, reset]);

  const onSubmit = async (data: SubcategoryFormData) => {
    try {
      setError(null);

      if (subcategoryId) {
        const numericId = Number(subcategoryId);
        if (Number.isNaN(numericId)) {
          setError("Invalid subcategory ID");
          showErrorToast({ message: "Invalid subcategory ID" });
          return;
        }

        const { error: updateError } = await updateSubcategory(numericId, data);
        if (updateError) {
          setError(updateError);
          showErrorToast({ message: updateError });
          return;
        }

        showSuccessToast({ message: "Subcategory updated successfully" });
      } else {
        const { success, error: createError } = await createSubcategory(data);
        if (!success) {
          setError(createError ?? "Failed to create subcategory");
          showErrorToast({ message: createError ?? "Failed to create subcategory" });
          return;
        }
        showSuccessToast({ message: "Subcategory created successfully" });
      }

      router.push("/dashboard/subcategories");
      router.refresh();
    } catch (_err) {
      setError("An unexpected error occurred");
      showErrorToast({ message: "An unexpected error occurred" });
    }
  };

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <FolderIcon className="h-8 w-8" />
          {subcategoryId ? "Edit Subcategory" : "Create New Subcategory"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {subcategoryId
            ? "Update the subcategory's information below."
            : "Fill in the subcategory's information below."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        {/* Required Fields Note */}
        <p className="text-xs">Fields marked with an asterisk (*) are required</p>

        {error && (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <NameField
            register={register}
            errors={errors}
            placeholder="Enter subcategory name"
          />
          <DescriptionField
            register={register}
            errors={errors}
            placeholder="Enter subcategory description"
          />
          <CategoryField
            register={register}
            errors={errors}
            categories={categories}
          />
        </div>

        <div className="flex justify-end space-x-4 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formIsSubmitting || isFormEmpty}
            className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white transition hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {formIsSubmitting
              ? "Processing..."
              : subcategoryId
              ? "Update Subcategory"
              : "Create Subcategory"}
          </button>
        </div>
      </form>
    </div>
  );
}
