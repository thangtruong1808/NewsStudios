"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormValues, createUserSchema, editUserSchema } from "./userSchema";
import { User } from "../../../../lib/definition";
import UserFormFields from "./UserFormFields";
import UserFormActions from "./UserFormActions";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useUserForm } from "./hooks/useUserForm";

/**
 * Props interface for the UserForm component
 */
interface UserFormProps {
  user?: User; // Optional user data for edit mode
  isEditMode?: boolean; // Flag to determine if form is in edit mode
}

/**
 * UserForm Component
 * A form component for creating and editing users with validation and error handling.
 * Supports both create and edit modes with different validation schemas.
 */
export default function UserForm({ user, isEditMode = false }: UserFormProps) {
  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    control,
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "user",
      status: user?.status || "active",
      description: user?.description || "",
      user_image: user?.user_image || "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Use custom hook for form operations
  const {
    isImageProcessing,
    uploadProgress,
    processingFileName,
    imagePreview,
    handleImageUpload,
    handleSubmit: handleFormSubmit,
    handleCancel,
  } = useUserForm(user, isEditMode);

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    isSubmitting || !isValid || (!isDirty && !isEditMode);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <UserGroupIcon className="h-8 w-8" />
          {isEditMode
            ? `Edit User: ${user?.firstname} - ${user?.lastname}`
            : "Create New User"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {isEditMode
            ? "Update the user's information below."
            : "Fill in the user's information below."}
        </p>
      </div>

      {/* Main form content */}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-4 sm:p-6 space-y-6"
      >
        <p className="text-xs">
          Fields marked with an asterisk (*) are required
        </p>

        {/* Form fields component with validation */}
        <UserFormFields
          register={register}
          errors={errors}
          isEditMode={isEditMode}
          control={control}
          userId={user?.id}
          onImageUpload={handleImageUpload}
          imagePreview={imagePreview}
          isImageProcessing={isImageProcessing}
          processingFileName={processingFileName}
          uploadProgress={uploadProgress}
        />

        {/* Form action buttons */}
        <UserFormActions
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          isSubmitDisabled={isSubmitDisabled}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}
