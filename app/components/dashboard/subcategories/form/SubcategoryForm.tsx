"use client";

import { useState, useEffect } from "react";
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
import { XMarkIcon, CheckIcon, FolderIcon } from "@heroicons/react/24/outline";
import { NameField, DescriptionField, CategoryField } from "./fields";

interface SubcategoryFormProps {
  subcategoryId?: string;
}

export default function SubcategoryForm({
  subcategoryId,
}: SubcategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Watch form values to determine if form is empty
  const formValues = watch();
  const isFormEmpty =
    !formValues.name && !formValues.description && !formValues.category_id;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories({});
      if (result.data) {
        setCategories(result.data as Category[]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategory data if in edit mode
  useEffect(() => {
    const fetchSubcategory = async () => {
      if (subcategoryId) {
        try {
          const numericId = parseInt(subcategoryId, 10);
          if (isNaN(numericId)) {
            setError("Invalid subcategory ID");
            showErrorToast({ message: "Invalid subcategory ID" });
            return;
          }

          const { data, error } = await getSubcategoryById(numericId);
          if (error) {
            setError(error);
            showErrorToast({ message: error || "Failed to load subcategory" });
          } else if (data) {
            reset({
              name: data.name,
              description: data.description,
              category_id: data.category_id,
            });
          }
        } catch (err) {
          setError("Failed to load subcategory");
          showErrorToast({ message: "Failed to load subcategory" });
        }
      }
    };

    fetchSubcategory();
  }, [subcategoryId, reset]);

  // Handle form submission
  const onSubmit = async (data: SubcategoryFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (subcategoryId) {
        const numericId = parseInt(subcategoryId, 10);
        if (isNaN(numericId)) {
          setError("Invalid subcategory ID");
          showErrorToast({ message: "Invalid subcategory ID" });
          return;
        }

        const { error } = await updateSubcategory(numericId, data);
        if (error) {
          setError(error);
          showErrorToast({ message: error });
        } else {
          showSuccessToast({ message: "Subcategory updated successfully" });
          router.push("/dashboard/subcategories");
          router.refresh();
        }
      } else {
        const response = await createSubcategory(data);
        if (!response.success) {
          setError(response.error);
          showErrorToast({
            message: response.error || "Failed to create subcategory",
          });
        } else {
          showSuccessToast({ message: "Subcategory created successfully" });
          router.push("/dashboard/subcategories");
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      showErrorToast({ message: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <FolderIcon className="h-8 w-8" />
          {subcategoryId ? "Edit Subcategory" : "Create New Subcategory"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {subcategoryId
            ? "Update the subcategory's information below."
            : "Fill in the subcategory's information below."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Required Fields Note */}
        <p className="text-xs">
          Fields marked with an asterisk (*) are required
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formIsSubmitting || isFormEmpty}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 border border-transparent rounded-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
