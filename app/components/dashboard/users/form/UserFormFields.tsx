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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { uploadToCloudinary } from "../../../../lib/utils/cloudinaryUtils";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface UserFormFieldsProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  isEditMode: boolean;
  control: Control<UserFormValues>;
  userId?: number;
}

export default function UserFormFields({
  register,
  errors,
  isEditMode,
  control,
  userId,
}: UserFormFieldsProps) {
  const { update: updateSession } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Watch the user_image field for changes
  const userImage = useWatch({
    control,
    name: "user_image",
  });

  // Update image preview when user_image changes
  useEffect(() => {
    if (userImage) {
      setImagePreview(userImage);
    }
  }, [userImage]);

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

      // Update the form value
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImageField
          register={register}
          errors={errors}
          userImage={imagePreview || ""}
          setImagePreview={setImagePreview}
        />

        <NameFields register={register} errors={errors} />

        <EmailField register={register} errors={errors} />

        <PasswordField
          register={register}
          errors={errors}
          isEditMode={isEditMode}
        />

        <RoleField register={register} errors={errors} />

        <StatusField register={register} errors={errors} />
      </div>

      <DescriptionField register={register} errors={errors} />
    </div>
  );
}
