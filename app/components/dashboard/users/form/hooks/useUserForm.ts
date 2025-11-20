"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { UseFormSetValue } from "react-hook-form";
import { User } from "@/app/lib/definition";
import { UserFormValues } from "../userSchema";
import { createUser, updateUser } from "@/app/lib/actions/users";
import {
  uploadToCloudinary,
  deleteImage,
  getPublicIdFromUrl,
} from "@/app/lib/utils/cloudinaryUtils";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

// Component Info
// Description: Custom hook for managing user form state and operations. Handles image uploads, form submission, and cleanup.
// Date updated: 2025-November-21
// Author: thangtruong
export function useUserForm(
  user?: User,
  isEditMode = false,
  setValue?: UseFormSetValue<UserFormValues>
) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingFileName, setProcessingFileName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(
    null
  );
  const [previousImagePublicId, setPreviousImagePublicId] = useState<
    string | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize image preview with user's existing image in edit mode
  useEffect(() => {
    if (isEditMode && user?.user_image) {
      setImagePreview(user.user_image);
      // Extract public ID from existing image URL
      const publicId = getPublicIdFromUrl(user.user_image);
      if (publicId) {
        setPreviousImagePublicId(publicId);
      }
    }
  }, [isEditMode, user?.user_image]);

  // Cleanup function for uploaded images
  const cleanupImage = useCallback(async () => {
    if (cloudinaryPublicId) {
      try {
        const result = await deleteImage(cloudinaryPublicId);
        if (result.success) {
          setCloudinaryPublicId(null);
        } else {
          showErrorToast({ message: "Failed to clean up image" });
        }
      } catch (error) {
        showErrorToast({ message: "Failed to clean up image" });
      }
    }
  }, [cloudinaryPublicId]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setIsImageProcessing(true);
      setProcessingFileName(file.name);
      setUploadProgress(0);

      // Create a local preview URL instead of uploading to Cloudinary
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
      
      // Update form value with preview URL to satisfy validation
      // The actual URL will be set after Cloudinary upload on submit
      if (setValue) {
        setValue("user_image", previewUrl, { shouldValidate: false });
      }
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to process image",
      });
    } finally {
      setIsImageProcessing(false);
      setProcessingFileName("");
      setUploadProgress(0);
    }
  };

  // Handle form submission
  const handleSubmit = async (data: UserFormValues) => {
    try {
      let imageUrl = data.user_image;

      // Only upload to Cloudinary if there's a selected file
      if (selectedFile) {
        const uploadResult = await uploadToCloudinary(selectedFile, "image");

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        if (!uploadResult.url) {
          throw new Error("Failed to get image URL from Cloudinary");
        }

        imageUrl = uploadResult.url;
      }

      if (isEditMode && user) {
        const success = await updateUser(user.id, {
          ...data,
          user_image: imageUrl,
        });

        if (success) {
          if (previousImagePublicId) {
            try {
              const deleteResult = await deleteImage(previousImagePublicId);
              if (!deleteResult.success) {
                showErrorToast({ message: "Failed to delete old image" });
              }
            } catch (error) {
              showErrorToast({ message: "Failed to delete old image" });
            }
          }

          // Check if the updated user is the current user
          const isCurrentUser = session?.user?.id === user.id.toString();

          if (isCurrentUser) {
            // If updating own profile, sign out and redirect to login
            showSuccessToast({
              message: "Profile updated. Please log in again.",
            });
            // Sign out and redirect to login page (user must login again)
            await signOut({
              redirect: true,
              callbackUrl: "/login",
            });
          } else {
            // For admin updating other users, redirect to users list after success toast
            showSuccessToast({ message: "User updated successfully" });
            // Navigate to users list page
            router.push("/dashboard/users");
            router.refresh();
          }
        } else {
          showErrorToast({ message: "Failed to update user" });
        }
      } else {
        const success = await createUser({
          ...data,
          user_image: imageUrl,
        });
        if (success) {
          showSuccessToast({ message: "User created successfully" });
          router.push("/dashboard/users");
          router.refresh();
        } else {
          showErrorToast({ message: "Failed to create user" });
        }
      }
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    try {
      await cleanupImage();
      router.back();
    } catch (error) {
      showErrorToast({ message: "Failed to clean up image" });
      router.back();
    }
  };

  return {
    isImageProcessing,
    uploadProgress,
    processingFileName,
    imagePreview,
    handleImageUpload,
    handleSubmit,
    handleCancel,
  };
}
