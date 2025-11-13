"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/app/components/dashboard/shared/toast/Toast";
import { Category } from "@/app/lib/definition";
import { createCategory, updateCategory } from "@/app/lib/actions/categories";
import { categorySchema, CategoryFormData } from "@/app/lib/validations/categorySchema";
import { NameField, DescriptionField } from "./form/fields";

// Component Info
// Description: Reusable category form handling create and update flows within the dashboard.
// Data created: Form state with validation, leading to category mutations via server actions.
// Author: thangtruong

interface CategoryFormProps {
  category?: Partial<Category>;
  isEditMode: boolean;
}

export default function CategoryForm({ category, isEditMode }: CategoryFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const result = isEditMode && category?.id
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (result.error) {
        showErrorToast({ message: result.error });
        return;
      }

      showSuccessToast({
        message: isEditMode
          ? `Category “${data.name}” updated successfully.`
          : `Category “${data.name}” created successfully.`,
      });

      router.push("/dashboard/categories");
      router.refresh();
    } catch (_error) {
      showErrorToast({ message: "Unexpected error while saving the category." });
    }
  };

  const isSubmitDisabled = isSubmitting || !isValid || (!isDirty && !isEditMode);

  return (
    <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <NameField register={register} errors={errors} />
        <DescriptionField register={register} errors={errors} />
      </div>

      {/* Form action buttons */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard/categories")}
          className="text-sm font-semibold leading-6 text-gray-900 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditMode ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
}
