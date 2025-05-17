"use client";

import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { UserFormValues } from "./userSchema";
import {
  ImageField,
  NameFields,
  EmailField,
  PasswordField,
  RoleField,
  StatusField,
  DescriptionField,
} from "./fields";

/**
 * Props interface for the UserFormFields component
 * Handles form field registration, validation errors, and form control
 */
interface UserFormFieldsProps {
  register: UseFormRegister<UserFormValues>; // Form field registration function
  errors: FieldErrors<UserFormValues>; // Form validation errors
  isEditMode: boolean; // Flag to determine if form is in edit mode
  control: Control<UserFormValues>; // Form control for field watching
  userId?: number; // Optional user ID for session updates
  onImageUpload: (file: File) => Promise<void>; // Image upload handler
  imagePreview: string | null; // Current image preview URL
  isImageProcessing: boolean; // Whether the image is being processed
  processingFileName: string; // Name of the file being processed
  uploadProgress: number; // Upload progress percentage
}

/**
 * UserFormFields Component
 * Renders and manages all form fields for user creation and editing.
 * Handles image upload, preview, and validation.
 */
export default function UserFormFields({
  register,
  errors,
  isEditMode,
  control,
  userId,
  onImageUpload,
  imagePreview,
  isImageProcessing,
  processingFileName,
  uploadProgress,
}: UserFormFieldsProps) {
  /**
   * Handles image file selection and triggers upload
   */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onImageUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* Grid layout for form fields */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Image upload field with preview */}
        <ImageField
          register={register}
          errors={errors}
          userImage={imagePreview || ""}
          onImageChange={handleImageChange}
          isProcessing={isImageProcessing}
          processingFileName={processingFileName}
          uploadProgress={uploadProgress}
        />

        {/* Name fields (first name and last name) */}
        <NameFields register={register} errors={errors} />

        {/* Email field with validation */}
        <EmailField register={register} errors={errors} />

        {/* Password field with show/hide functionality */}
        <PasswordField
          register={register}
          errors={errors}
          isEditMode={isEditMode}
        />

        {/* Role selection field */}
        <RoleField register={register} errors={errors} />

        {/* Status selection field */}
        <StatusField register={register} errors={errors} />
      </div>

      {/* Description field (full width) */}
      <DescriptionField register={register} errors={errors} />
    </div>
  );
}
