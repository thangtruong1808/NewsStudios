"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagFormValues, tagSchema } from "../types";
import TagFormFields from "./TagFormFields";
import { createTag, updateTag } from "@/app/lib/actions/tags";
import toast from "react-hot-toast";

interface TagFormProps {
  tag?: Partial<TagFormValues>;
  isEditMode?: boolean;
  tagId?: number;
}

export default function TagForm({
  tag,
  isEditMode = false,
  tagId,
}: TagFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag,
  });

  const onSubmit = async (data: TagFormValues) => {
    try {
      if (isEditMode && tagId) {
        await updateTag(tagId, data);
        toast.success("Tag updated successfully");
      } else {
        await createTag(data);
        toast.success("Tag created successfully");
      }
      router.push("/dashboard/tags");
      router.refresh();
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save tag");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Edit Tag" : "Create New Tag"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <TagFormFields register={register} errors={errors} />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/tags")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Tag"
              : "Create Tag"}
          </button>
        </div>
      </form>
    </div>
  );
}
