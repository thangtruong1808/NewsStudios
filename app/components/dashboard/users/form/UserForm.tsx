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
import { useState, useEffect, useRef } from "react";
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

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setIsImageProcessing(true);
      setProcessingFileName(file.name);
      setUploadProgress(0);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (limit to 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Image file size must be less than 500MB");
        return;
      }

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, "image");

      // Clear progress interval
      clearInterval(progressInterval);

      if (!result.success || !result.url) {
        toast.error(`Failed to upload image: ${result.error}`);
        return;
      }

      // Set progress to 100% when upload is complete
      setUploadProgress(100);

      // Extract public ID from the URL using the utility function
      const publicId = getPublicIdFromUrl(result.url);
      console.log("Uploaded image public ID:", publicId);

      if (!publicId) {
        console.error("Failed to extract public ID from URL:", result.url);
        toast.error("Failed to process uploaded image");
        return;
      }

      // Store the public ID for cleanup
      setCloudinaryPublicId(publicId);

      // Update the form value with the uploaded image URL
      setValue("user_image", result.url);
      setImagePreview(result.url);

      // Update session if this is the current user's profile
      if (isEditMode && user?.id) {
        await updateSession();
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      // Add a small delay before hiding the processing state
      setTimeout(() => {
        setIsImageProcessing(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  console.log("UserForm - Current Session:", session);
  console.log("UserForm - Editing User:", user);

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Updates session and redirects on success
   */
  const onSubmit = async (data: UserFormValues) => {
    try {
      console.log("Submitting form data:", data);
      console.log("Current cloudinaryPublicId:", cloudinaryPublicId);

      if (isEditMode && user) {
        console.log("Updating existing user:", user.id);
        const success = await updateUser(user.id, data);
        if (success) {
          // If there was a previous image and it's different from the new one, delete it
          if (
            previousImagePublicId &&
            previousImagePublicId !== cloudinaryPublicId
          ) {
            console.log("Deleting previous image:", previousImagePublicId);
            await deleteImage(previousImagePublicId);
          }
          console.log("User updated successfully, updating session");
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              ...data,
              id: user.id.toString(),
            },
          });
          console.log("Session updated");
          showSuccessToast({ message: "User updated successfully" });
          router.push("/dashboard/users");
          router.refresh();
        } else {
          // If update fails, delete the new image if it exists
          if (cloudinaryPublicId) {
            console.log(
              "Update failed, deleting new image:",
              cloudinaryPublicId
            );
            await deleteImage(cloudinaryPublicId);
          }
          console.log("Failed to update user");
          showErrorToast({ message: "Failed to update user" });
        }
      } else {
        console.log("Creating new user");
        const success = await createUser(data);
        if (success) {
          console.log("User created successfully");
          showSuccessToast({ message: "User created successfully" });
          router.push("/dashboard/users");
          router.refresh();
        } else {
          // If creation fails, delete the uploaded image
          if (cloudinaryPublicId) {
            console.log("Creation failed, deleting image:", cloudinaryPublicId);
            await deleteImage(cloudinaryPublicId);
          }
          console.log("Failed to create user");
          showErrorToast({ message: "Failed to create user" });
        }
      }
    } catch (error) {
      // If any error occurs, delete the uploaded image
      if (cloudinaryPublicId) {
        console.log("Error occurred, deleting image:", cloudinaryPublicId);
        await deleteImage(cloudinaryPublicId);
      }
      console.error("Error submitting form:", error);
      showErrorToast({
        message: "An error occurred while submitting the form",
      });
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

  // Cleanup function for unmounting
  useEffect(() => {
    let isMounted = true;

    const cleanup = async () => {
      if (!isMounted) return;

      // Only delete if we still have a public ID (meaning it wasn't deleted by handleCancel)
      if (cloudinaryPublicId) {
        console.log("Cleaning up image on unmount:", cloudinaryPublicId);
        try {
          // Retry mechanism for deletion
          let retryCount = 0;
          const maxRetries = 3;
          let success = false;

          while (retryCount < maxRetries && !success && isMounted) {
            const result = await deleteImage(cloudinaryPublicId);
            if (result.success) {
              success = true;
              console.log("Successfully deleted image on unmount");
              if (isMounted) {
                setCloudinaryPublicId(null);
              }
            } else {
              retryCount++;
              console.error(
                `Failed to delete image (attempt ${retryCount}/${maxRetries}):`,
                result.error
              );
              if (retryCount < maxRetries && isMounted) {
                // Wait for 1 second before retrying
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            }
          }

          if (!success && isMounted) {
            console.error("Failed to delete image after all retries");
            toast.error("Failed to clean up image");
          }
        } catch (error) {
          console.error("Error deleting image on unmount:", error);
          if (isMounted) {
            toast.error("Failed to clean up image");
          }
        }
      }
    };

    // Run cleanup when component unmounts
    return () => {
      isMounted = false;
      // Execute cleanup immediately
      cleanup();
    };
  }, [cloudinaryPublicId]);

  // Add a cleanup effect for navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (cloudinaryPublicId) {
        console.log("Cleaning up image before navigation:", cloudinaryPublicId);
        deleteImage(cloudinaryPublicId)
          .then((result) => {
            if (result.success) {
              console.log("Successfully deleted image before navigation");
              setCloudinaryPublicId(null);
            } else {
              console.error(
                "Failed to delete image before navigation:",
                result.error
              );
            }
          })
          .catch((error) => {
            console.error("Error deleting image before navigation:", error);
          });
      }
    };

    // Add event listener for navigation
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cloudinaryPublicId]);

  // Handle pathname changes for navigation cleanup
  useEffect(() => {
    if (previousPathRef.current !== pathname && cloudinaryPublicId) {
      console.log("Path changed, cleaning up image:", cloudinaryPublicId);
      deleteImage(cloudinaryPublicId)
        .then((result) => {
          if (result.success) {
            console.log("Successfully deleted image after navigation");
            setCloudinaryPublicId(null);
          } else {
            console.error(
              "Failed to delete image after navigation:",
              result.error
            );
          }
        })
        .catch((error) => {
          console.error("Error deleting image after navigation:", error);
        });
    }
    previousPathRef.current = pathname;
  }, [pathname, cloudinaryPublicId]);

  // Handle cancel button click
  const handleCancel = async () => {
    try {
      // If there's a new image uploaded but not saved, delete it
      if (cloudinaryPublicId) {
        console.log(
          "Attempting to delete image with public ID:",
          cloudinaryPublicId
        );

        // Retry mechanism for deletion
        let retryCount = 0;
        const maxRetries = 3;
        let success = false;

        while (retryCount < maxRetries && !success) {
          const deleteResult = await deleteImage(cloudinaryPublicId);
          if (deleteResult.success) {
            success = true;
            console.log("Successfully deleted image from Cloudinary");
            setCloudinaryPublicId(null);
          } else {
            retryCount++;
            console.error(
              `Failed to delete image (attempt ${retryCount}/${maxRetries}):`,
              deleteResult.error
            );
            if (retryCount < maxRetries) {
              // Wait for 1 second before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        if (!success) {
          console.error("Failed to delete image after all retries");
          toast.error("Failed to clean up image");
        }
      }
      router.back();
    } catch (error) {
      console.error("Error cleaning up image:", error);
      toast.error("Failed to clean up image");
      // Still navigate back even if cleanup fails
      router.back();
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
