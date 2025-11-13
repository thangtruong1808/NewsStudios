"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ProcessingUpload from "@/app/components/dashboard/shared/processing-upload/ProcessingUpload";
import { UserFormValues } from "../userSchema";
import { showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

/* eslint-disable no-unused-vars */
interface ImageFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  userImage: string;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isProcessing?: boolean;
  processingFileName?: string;
  uploadProgress?: number;
}
/* eslint-enable no-unused-vars */

// Description: Render user profile image uploader with preview, upload progress, and failure handling.
// Data created: 2024-11-13
// Author: thangtruong
export default function ImageField({
  register,
  errors,
  userImage,
  onImageChange,
  isProcessing = false,
  processingFileName,
  uploadProgress = 0,
}: ImageFieldProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const displayImage = !userImage || hasImageError ? "/placeholder-image.jpg" : userImage;

  const { onChange: registerOnChange, ...registerProps } = register("user_image");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    registerOnChange(event);
    try {
      await onImageChange(event);
      setHasImageError(false);
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to process the selected image.",
      });
    }
  };

  const handlePreviewError = () => {
    if (!hasImageError) {
      setHasImageError(true);
      showErrorToast({ message: "Unable to load profile image preview." });
    }
  };

  return (
    <div className="col-span-full">
      {/* Image upload label */}
      <label htmlFor="user_image" className="block text-sm font-medium">
        Profile Image <span className="text-xs">(optional)</span>
      </label>

      {/* File input with custom styling */}
      <div className="mt-2">
        <input
          type="file"
          id="user_image"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-medium file:text-blue-600 hover:file:from-blue-700 hover:file:to-blue-500"
          {...registerProps}
        />
      </div>

      {/* Processing Upload Status */}
      <ProcessingUpload
        isProcessing={isProcessing}
        fileName={processingFileName}
        fileType="image"
        progress={uploadProgress}
      />

      {/* Image preview section */}
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-700">Preview:</p>
        {userImage ? (
          <div className="mt-1 relative h-24 w-24 overflow-hidden rounded-md">
            <Image
              src={displayImage}
              alt="Profile preview"
              fill
              className="object-cover"
              sizes="96px"
              onError={handlePreviewError}
              priority={false}
            />
          </div>
        ) : (
          <div className="mt-1 relative h-24 w-24 overflow-hidden rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50">
            <PhotoIcon className="h-10 w-10 text-gray-500" />
            <span className="text-xs text-gray-500 text-center">
              No profile image selected
            </span>
          </div>
        )}
      </div>

      {/* Error message display */}
      {errors.user_image && (
        <p className="mt-2 text-sm text-red-600">{errors.user_image.message}</p>
      )}
    </div>
  );
}
