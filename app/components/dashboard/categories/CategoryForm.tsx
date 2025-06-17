"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Category } from "@/app/lib/definition";
import { createCategory, updateCategory } from "@/app/lib/actions/categories";
import { categorySchema, CategoryFormData } from "@/app/lib/validations/categorySchema";
import { NameField, DescriptionField } from "./form/fields";

interface CategoryFormProps {
  category?: Partial<Category>;
  isEditMode: boolean;
}

export default function CategoryForm({ category, isEditMode }: CategoryFormProps) {
  const router = useRouter();
  const _category = category;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditMode && category?.id) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }
      router.push("/dashboard/categories");
      router.refresh();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <NameField register={register} errors={errors} />
        <DescriptionField register={register} errors={errors} />
      </div>
    </form>
  );
}
