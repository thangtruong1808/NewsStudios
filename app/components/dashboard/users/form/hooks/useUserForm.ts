"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

/**
 * Custom hook for managing user form state and operations
 * Handles image uploads, form submission, and cleanup
 */
export function useUserForm(user?: User, isEditMode = false) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
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

      const uploadResult = await uploadToCloudinary(file, "image");
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "Failed to upload image");
      }

      const cloudinaryUrl = uploadResult.url.secure_url;
      if (!cloudinaryUrl) {
        throw new Error("Failed to get image URL from Cloudinary");
      }

      const publicId = getPublicIdFromUrl(cloudinaryUrl);
      if (!publicId) {
        throw new Error("Failed to extract public ID from URL");
      }

      setImagePreview(cloudinaryUrl);
      setCloudinaryPublicId(publicId);
      setSelectedFile(file);

      if (isEditMode && user?.user_image) {
        const oldPublicId = getPublicIdFromUrl(user.user_image);
        if (oldPublicId) {
          setPreviousImagePublicId(oldPublicId);
        }
      }
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to upload image",
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
      if (isEditMode && user) {
        let imageUrl = user.user_image;
        let newPublicId: string | null = null;

        if (selectedFile) {
          const uploadResult = await uploadToCloudinary(selectedFile, "image");
          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || "Failed to upload image");
          }

          const cloudinaryUrl = uploadResult.url.secure_url;
          if (!cloudinaryUrl) {
            throw new Error("Failed to get image URL from Cloudinary");
          }

          const publicId = getPublicIdFromUrl(cloudinaryUrl);
          if (!publicId) {
            throw new Error("Failed to extract public ID from URL");
          }

          imageUrl = cloudinaryUrl;
          newPublicId = publicId;
          setCloudinaryPublicId(publicId);
        }

        const success = await updateUser(user.id, {
          ...data,
          user_image: imageUrl,
        });

        if (success) {
          if (previousImagePublicId && previousImagePublicId !== newPublicId) {
            try {
              const deleteResult = await deleteImage(previousImagePublicId);
              if (!deleteResult.success) {
                showErrorToast({ message: "Failed to delete old image" });
              }
            } catch (error) {
              showErrorToast({ message: "Failed to delete old image" });
            }
          }
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              ...data,
              id: user.id.toString(),
            },
          });
          showSuccessToast({ message: "User updated successfully" });
          router.push("/dashboard/users");
          router.refresh();
        } else {
          if (newPublicId) {
            try {
              await deleteImage(newPublicId);
            } catch (error) {
              showErrorToast({ message: "Failed to clean up new image" });
            }
          }
          showErrorToast({ message: "Failed to update user" });
        }
      } else {
        const success = await createUser(data);
        if (success) {
          showSuccessToast({ message: "User created successfully" });
          router.push("/dashboard/users");
          router.refresh();
        } else {
          if (cloudinaryPublicId) {
            try {
              await deleteImage(cloudinaryPublicId);
            } catch (error) {
              showErrorToast({ message: "Failed to clean up image" });
            }
          }
          showErrorToast({ message: "Failed to create user" });
        }
      }
    } catch (error) {
      if (cloudinaryPublicId) {
        try {
          await deleteImage(cloudinaryPublicId);
        } catch (error) {
          showErrorToast({ message: "Failed to clean up image" });
        }
      }
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
