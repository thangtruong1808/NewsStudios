"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormValues, createUserSchema, editUserSchema } from "./userSchema";
import { User } from "../../../../lib/definition";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { createUser, updateUser } from "../../../../lib/actions/users";
import UserFormFields from "./UserFormFields";
import { useSession } from "next-auth/react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../dashboard/shared/toast/Toast";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  uploadToCloudinary,
  deleteImage,
  getPublicIdFromUrl,
} from "../../../../lib/utils/cloudinaryUtils";

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
  const router = useRouter();
  const pathname = usePathname();
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
  const previousPathRef = useRef(pathname);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Create a cleanup function that can be reused
  const cleanupImage = useCallback(async () => {
    if (cloudinaryPublicId) {
      try {
        const result = await deleteImage(cloudinaryPublicId);
        if (result.success) {
          setCloudinaryPublicId(null);
        } else {
          toast.error("Failed to clean up image");
        }
      } catch (error) {
        toast.error("Failed to clean up image");
      }
    }
  }, [cloudinaryPublicId]);

  // Handle cancel button click
  const handleCancel = async () => {
    try {
      await cleanupImage();
      router.back();
    } catch (error) {
      toast.error("Failed to clean up image");
      router.back();
    }
  };

  // Initialize image preview with user's existing image in edit mode
  useEffect(() => {
    if (isEditMode && user?.user_image) {
      setImagePreview(user.user_image);
      // Extract public ID from existing image URL using utility function
      const publicId = getPublicIdFromUrl(user.user_image);
      if (publicId) {
        setPreviousImagePublicId(publicId);
      }
    }
  }, [isEditMode, user?.user_image]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setIsImageProcessing(true);
      setProcessingFileName(file.name);
      setUploadProgress(0);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showErrorToast({ message: "Please select an image file" });
        return;
      }

      // Validate file size (limit to 500MB)
      if (file.size > 500 * 1024 * 1024) {
        showErrorToast({ message: "Image file size must be less than 500MB" });
        return;
      }

      // Start progress simulation for preview
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file); // Store the file for later upload

      // Set progress to 100% when preview is ready
      setUploadProgress(100);
      showSuccessToast({ message: "Image selected successfully" });
    } catch (error) {
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to process image",
      });
    } finally {
      // Add a small delay before hiding the processing state
      setTimeout(() => {
        setIsImageProcessing(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Updates session and redirects on success
   */
  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isEditMode && user) {
        // If there's a new file selected, upload it first
        let imageUrl = user.user_image;
        let newPublicId: string | null = null;

        if (selectedFile) {
          const uploadResult = await uploadToCloudinary(selectedFile, "image");

          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || "Failed to upload image");
          }

          // Extract the secure_url from the Cloudinary response
          const cloudinaryUrl = uploadResult.url.secure_url;
          if (!cloudinaryUrl) {
            throw new Error("Failed to get image URL from Cloudinary");
          }

          // Extract public ID from the URL
          const publicId = getPublicIdFromUrl(cloudinaryUrl);
          if (!publicId) {
            throw new Error("Failed to extract public ID from URL");
          }

          // Store the new image URL and public ID
          imageUrl = cloudinaryUrl;
          newPublicId = publicId;
          setCloudinaryPublicId(publicId);

          // If there was a previous image, store its public ID for cleanup
          if (user.user_image) {
            const oldPublicId = getPublicIdFromUrl(user.user_image);
            if (oldPublicId) {
              setPreviousImagePublicId(oldPublicId);
            }
          }
        }

        // Update user with new data
        const success = await updateUser(user.id, {
          ...data,
          user_image: imageUrl,
        });

        if (success) {
          // If there was a previous image and it's different from the new one, delete it
          if (previousImagePublicId && previousImagePublicId !== newPublicId) {
            try {
              const deleteResult = await deleteImage(previousImagePublicId);
              if (!deleteResult.success) {
                showErrorToast({
                  message: "Failed to delete old image from Cloudinary",
                });
              }
            } catch (error) {
              showErrorToast({
                message: "Failed to delete old image from Cloudinary",
              });
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
          // If update fails, delete the new image if it exists
          if (newPublicId) {
            try {
              await deleteImage(newPublicId);
            } catch (error) {
              showErrorToast({
                message: "Failed to clean up new image after failed update",
              });
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
          // If creation fails, delete the uploaded image
          if (cloudinaryPublicId) {
            try {
              await deleteImage(cloudinaryPublicId);
            } catch (error) {
              showErrorToast({
                message: "Failed to clean up image after failed creation",
              });
            }
          }
          showErrorToast({ message: "Failed to create user" });
        }
      }
    } catch (error) {
      // If any error occurs, delete the uploaded image
      if (cloudinaryPublicId) {
        try {
          await deleteImage(cloudinaryPublicId);
        } catch (error) {
          showErrorToast({ message: "Failed to clean up image after error" });
        }
      }
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting the form",
      });
    }
  };

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    control,
    setValue,
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

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    isSubmitting || !isValid || (!isDirty && !isEditMode);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode
            ? `Edit User: ${user?.firstname} ${user?.lastname}`
            : "Create New User"}
        </h2>
      </div>

      {/* Main form content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6">
        <p className="text-xs text-gray-500">
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
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 border border-transparent rounded-md shadow-sm hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
