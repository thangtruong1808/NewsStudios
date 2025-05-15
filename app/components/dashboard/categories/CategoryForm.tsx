"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  categorySchema,
  type CategoryFormData,
} from "../../../lib/validations/categorySchema";
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "../../../lib/actions/categories";
import { Category } from "../../../lib/definition";
import toast from "react-hot-toast";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Props interface for CategoryForm component
 * @property {string} [categoryId] - Optional ID for editing existing category
 */
interface CategoryFormProps {
  categoryId?: string;
}

/**
 * CategoryForm Component
 * Handles both creation and editing of categories with form validation and error handling.
 * Features:
 * - Form state management with React Hook Form
 * - Zod schema validation
 * - Dynamic loading of existing category data
 * - Error handling and toast notifications
 * - Responsive form layout with gradient styling
 */
export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with React Hook Form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
  });

  // Watch form values to determine if form is empty
  const formValues = watch();
  const isFormEmpty = !formValues.name && !formValues.description;

  /**
   * Fetch existing category data when in edit mode
   * Handles error cases and redirects on failure
   */
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        setIsLoading(true);
        try {
          const numericId = parseInt(categoryId, 10);
          if (isNaN(numericId)) {
            setError("Invalid category ID");
            toast.error("Invalid category ID");
            return;
          }

          const { data, error } = await getCategoryById(numericId);
          if (error) {
            setError(error);
            toast.error(error);
            router.push("/dashboard/categories");
            return;
          }

          if (!data) {
            setError("Category not found");
            toast.error("Category not found");
            router.push("/dashboard/categories");
            return;
          }

          setCategory(data as Category);
          reset({
            name: data.name,
            description: data.description || "",
          });
        } catch (err) {
          setError("Failed to fetch category");
          toast.error("Failed to fetch category");
          router.push("/dashboard/categories");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategory();
  }, [categoryId, reset, router]);

  /**
   * Handle form submission for both create and update operations
   * Includes validation, error handling, and success notifications
   */
  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (categoryId) {
        const numericId = parseInt(categoryId, 10);
        if (isNaN(numericId)) {
          setError("Invalid category ID");
          toast.error("Invalid category ID");
          return;
        }

        const { error } = await updateCategory(numericId, data);
        if (error) {
          setError(error);
          toast.error(error);
        } else {
          toast.success("Category updated successfully");
          router.push("/dashboard/categories");
          router.refresh();
        }
      } else {
        const { error } = await createCategory(data);
        if (error) {
          setError(error);
          toast.error(error);
        } else {
          toast.success("Category created successfully");
          router.push("/dashboard/categories");
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching category data
  if (categoryId && isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white">
          {categoryId ? "Edit Category" : "Create New Category"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-xs text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              placeholder="Enter category name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description{" "}
              <span className="text-xs text-gray-500">(optional)</span>
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Enter category description"
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/categories")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isFormEmpty}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 border border-transparent rounded-md shadow-sm hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Processing..."
              : categoryId
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
