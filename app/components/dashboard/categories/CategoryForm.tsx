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
import { Category } from "../../../login/login-definitions";
import toast from "react-hot-toast";

interface CategoryFormProps {
  categoryId?: string;
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

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
          } else if (data) {
            setCategory(data as Category);
            reset({
              name: data.name,
              description: data.description || "",
            });
          }
        } catch (err) {
          setError("Failed to fetch category");
          toast.error("Failed to fetch category");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategory();
  }, [categoryId, reset]);

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

  if (categoryId && isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
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
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-6"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : categoryId
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
