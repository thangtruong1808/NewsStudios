"use client";

import type { ChangeEvent } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  ImageField,
  NameFields,
  EmailField,
  PasswordField,
  RoleField,
  StatusField,
  DescriptionField,
} from "./fields";
import { UserFormValues } from "./userSchema";

/* eslint-disable no-unused-vars */
interface UserFormFieldsProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  isEditMode: boolean;
  onImageUpload: (file: File) => Promise<void>;
  imagePreview: string | null;
  isImageProcessing: boolean;
  processingFileName?: string;
  uploadProgress?: number;
}
/* eslint-enable no-unused-vars */

// Description: Assemble user form sections including image upload, identity, roles, and metadata fields.
// Data created: 2024-11-13
// Author: thangtruong
export default function UserFormFields({
  register,
  errors,
  isEditMode,
  onImageUpload,
  imagePreview,
  isImageProcessing,
  processingFileName,
  uploadProgress = 0,
}: UserFormFieldsProps) {
  // Handle profile image selection and trigger upload workflow.
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await onImageUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* Grid layout for primary user fields */}
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

        {/* Name fields (first and last name) */}
        <NameFields register={register} errors={errors} />

        {/* Email field */}
        <EmailField register={register} errors={errors} />

        {/* Password field */}
        <PasswordField register={register} errors={errors} isEditMode={isEditMode} />

        {/* Role selection */}
        <RoleField register={register} errors={errors} />

        {/* Status selection */}
        <StatusField register={register} errors={errors} />
      </div>

      {/* Description field */}
      <DescriptionField register={register} errors={errors} />
    </div>
  );
}
