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
import toast from "react-hot-toast";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
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

  // Handle form submission
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {subcategoryId ? "Edit Subcategory" : "Create New Subcategory"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Required Fields Note */}
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <CategoryField
            register={register}
            errors={errors}
            categories={categories}
          />
          <NameField register={register} errors={errors} />
          <DescriptionField register={register} errors={errors} />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/subcategories")}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
