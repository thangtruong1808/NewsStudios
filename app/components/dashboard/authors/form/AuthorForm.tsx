"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Author } from "@/app/lib/definition";
import { authorSchema } from "./authorSchema";
import { useRouter } from "next/navigation";
import { createAuthor, updateAuthor } from "@/app/lib/actions/authors";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import { AuthorFormFields } from "./fields";
import { UserIcon } from "@heroicons/react/24/outline";

// Form data type that matches the schema
type AuthorFormData = {
  name: string;
  description?: string;
  bio?: string;
};

/**
 * Props interface for the AuthorForm component
 * @property author - Optional author data for edit mode
 */
interface AuthorFormProps {
  author?: Author;
}

/**
 * AuthorForm Component
 * A form component for creating and editing authors with validation and error handling.
 * Features:
 * - Form validation using react-hook-form and zod
 * - Create and edit mode support
 * - Real-time validation
 * - Error handling with toast notifications
 * - Responsive layout with gradient styling
 */
export default function AuthorForm({ author }: AuthorFormProps) {
  const router = useRouter();
  const isEditMode = !!author;

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: author || {
      name: "",
      description: "",
      bio: "",
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
  const onSubmit = async (data: AuthorFormData) => {
    try {
      if (isEditMode && author) {
        await updateAuthor(author.id, data);
        showSuccessToast({ message: "Author updated successfully" });
      } else {
        await createAuthor(data);
        showSuccessToast({ message: "Author created successfully" });
      }
      router.push("/dashboard/author");
      router.refresh();
    } catch (error) {
      showErrorToast({ message: "Something went wrong" });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-lg font-medium text-white flex items-center gap-2">
          <UserIcon className="h-8 w-8" />
          {isEditMode ? "Edit Author" : "Create Author"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {isEditMode
            ? "Update the author's information below."
            : "Fill in the author's information below."}
        </p>
      </div>

      {/* Main form content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-xs ">
          Fields marked with an asterisk (*) are required
        </p>

        {/* Form fields component with validation */}
        <AuthorFormFields
          register={register}
          errors={errors}
        />

        {/* Form action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              ? "Update Author"
              : "Create Author"}
          </button>
        </div>
      </form>
    </div>
  );
}
