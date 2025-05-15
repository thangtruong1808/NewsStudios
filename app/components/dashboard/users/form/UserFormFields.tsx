"use client";

import {
  UseFormRegister,
  FieldErrors,
  useWatch,
  Control,
} from "react-hook-form";
import { UserFormValues } from "./userSchema";
import { useState, useEffect } from "react";
import {
  ImageField,
  NameFields,
  EmailField,
  PasswordField,
  RoleField,
  StatusField,
  DescriptionField,
} from "./fields";
import { uploadToCloudinary } from "../../../../lib/utils/cloudinaryUtils";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

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
}: UserFormFieldsProps) {
  const { update: updateSession } = useSession();

  // State management for form fields
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Watch the user_image field for changes to update preview
  const userImage = useWatch({
    control,
    name: "user_image",
  });

  // Update image preview when user_image field changes
  useEffect(() => {
    if (userImage) {
      setImagePreview(userImage);
    }
  }, [userImage]);

  /**
   * Handles image file selection, validation, and upload
   * Includes file type and size validation, preview generation,
   * and Cloudinary upload integration
   */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        setImagePreview(null);
        return;
      }

      // Validate file size (limit to 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Image file size must be less than 500MB");
        setImagePreview(null);
        return;
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, "image");

      if (!result.success || !result.url) {
        toast.error(`Failed to upload image: ${result.error}`);
        setImagePreview(null);
        return;
      }

      // Update the form value with the uploaded image URL
      const { onChange } = register("user_image");
      onChange({
        target: {
          name: "user_image",
          value: result.url,
        },
      });

      // Update preview with the Cloudinary URL
      setImagePreview(result.url);

      // Update session if this is the current user's profile
      if (isEditMode && userId) {
        await updateSession();
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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
          setImagePreview={setImagePreview}
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
