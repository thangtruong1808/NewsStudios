"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagFormValues, tagSchema } from "../types";
import TagFormFields from "./TagFormFields";
import { createTag, updateTag } from "@/app/lib/actions/tags";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/**
 * Props interface for TagForm component
 * @property tag - Optional tag data for edit mode
 * @property isEditMode - Boolean flag to determine if form is in edit mode
 * @property tagId - Optional ID of the tag being edited
 */
interface TagFormProps {
  tag?: Partial<TagFormValues>;
  isEditMode?: boolean;
  tagId?: number;
}

/**
 * TagForm Component
 * A form component for creating and editing tags with validation and error handling.
 * Features:
 * - Form validation using react-hook-form and zod
 * - Create and edit mode support
 * - Real-time validation
 * - Error handling with toast notifications
 * - Responsive layout with gradient styling
 */
export default function TagForm({
  tag,
  isEditMode = false,
  tagId,
}: TagFormProps) {
  const router = useRouter();

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag || {
      name: "",
      description: "",
      color: "",
    },
  });

  // Watch form values for button disable state
  const formValues = watch();
  const isFormEmpty = !formValues.name.trim();

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Handles success/error notifications and navigation
   */
  const onSubmit = async (data: TagFormValues) => {
    try {
      if (isEditMode && tagId) {
        await updateTag(tagId, data);
        showSuccessToast({ message: "Tag updated successfully" });
      } else {
        await createTag(data);
        showSuccessToast({ message: "Tag created successfully" });
      }
      router.push("/dashboard/tags");
      router.refresh();
    } catch (error) {
      console.error("Error saving tag:", error);
      showErrorToast({ message: "Failed to save tag" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Edit Tag" : "Create New Tag"}
        </h2>
      </div>

      {/* Main form content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-xs text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        {/* Form fields component with validation */}
        <TagFormFields register={register} errors={errors} />

        {/* Form action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/tags")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (!isEditMode && isFormEmpty)}
            className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
