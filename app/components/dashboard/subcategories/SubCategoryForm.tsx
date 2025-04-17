"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  subcategorySchema,
  type SubcategoryFormData,
} from "../../../lib/validations/subcategorySchema";
import {
  createSubcategory,
  updateSubcategory,
  getSubcategoryById,
} from "../../../lib/actions/subcategories";
import { getCategories } from "../../../lib/actions/categories";
import { Category } from "../../../lib/definition";
import toast from "react-hot-toast";

interface SubCategoryFormProps {
  subcategoryId?: string;
}

export default function SubCategoryForm({
  subcategoryId,
}: SubCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategorySchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      if (result.data) {
        setCategories(result.data as Category[]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategory = async () => {
      if (subcategoryId) {
        setIsLoading(true);
        try {
          const numericId = parseInt(subcategoryId, 10);
          if (isNaN(numericId)) {
            setError("Invalid subcategory ID");
            return;
          }

          const { data, error } = await getSubcategoryById(numericId);
          if (error) {
            setError(error);
          } else if (data) {
            reset({
              name: data.name,
              description: data.description,
              category_id: data.category_id,
            });
          }
        } catch (err) {
          setError("Failed to load subcategory");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSubcategory();
  }, [subcategoryId, reset]);

  const onSubmit = async (data: SubcategoryFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (subcategoryId) {
        const numericId = parseInt(subcategoryId, 10);
        if (isNaN(numericId)) {
          setError("Invalid subcategory ID");
          toast.error("Invalid subcategory ID");
          return;
        }

        const { error } = await updateSubcategory(numericId, data);
        if (error) {
          setError(error);
          toast.error(error);
        } else {
          toast.success("Subcategory updated successfully");
          router.push("/dashboard/subcategories");
          router.refresh();
        }
      } else {
        const response = await createSubcategory(data);
        if (!response.success) {
          setError(response.error);
          toast.error(response.error);
        } else {
          toast.success("Subcategory created successfully");
          router.push("/dashboard/subcategories");
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

  if (subcategoryId && isLoading) {
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
            htmlFor="category_id"
            className="block text-sm font-medium text-gray-700"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category_id"
            {...register("category_id", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category_id.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name SubCategory<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : subcategoryId
              ? "Update Subcategory"
              : "Create Subcategory"}
          </button>
        </div>
      </form>
    </div>
  );
}
