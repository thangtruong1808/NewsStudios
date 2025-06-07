"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ProcessingUpload from "@/app/components/dashboard/shared/processing-upload/ProcessingUpload";

/**
 * Props interface for the ImageField component
 * Handles image upload, preview, and form integration
 */
interface ImageFieldProps {
  register: UseFormRegister<UserFormValues>; // Form field registration function
  errors: FieldErrors<UserFormValues>; // Form validation errors
  userImage: string; // Current image URL or preview
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>; // Image change handler
  isProcessing?: boolean; // Whether the image is being processed
  processingFileName?: string; // Name of the file being processed
  uploadProgress?: number; // Upload progress percentage
}

/**
 * ImageField Component
 * Handles user profile image upload with preview functionality.
 * Includes file validation, Cloudinary integration, and error handling.
 */
export default function ImageField({
  register,
  errors,
  userImage,
  onImageChange,
  isProcessing = false,
  processingFileName,
  uploadProgress = 0,
}: ImageFieldProps) {
  return (
    <div className="col-span-full">
      {/* Image upload label */}
      <label htmlFor="user_image" className="block text-sm font-medium">
        Profile Image
      </label>

      {/* File input with custom styling */}
      <div className="mt-2">
        <input
          type="file"
          id="user_image"
          accept="image/*"
          onChange={onImageChange}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-medium file:text-blue-600 hover:file:from-blue-700 hover:file:to-blue-500"
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
      {userImage ? (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Preview:</p>
          <div className="mt-1 relative h-24 w-24 overflow-hidden rounded-md">
            <img
              src={userImage}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error("Error loading image:", userImage);
                (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Preview:</p>
          <div className="mt-1 relative h-24 w-24 overflow-hidden rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50">
            <PhotoIcon className="h-10 w-10 text-gray-500" />
            <span className="text-xs text-gray-500 text-center">
              No profile image selected
            </span>
          </div>
        </div>
      )}

      {/* Error message display */}
      {errors.user_image && (
        <p className="mt-2 text-sm text-red-600">{errors.user_image.message}</p>
      )}
    </div>
  );
}
