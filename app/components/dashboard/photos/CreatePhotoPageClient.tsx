"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Article, Image } from "@/app/lib/definition";
import {
  uploadImageToServer,
  updateImage,
  createImage,
} from "@/app/lib/actions/images";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import ImageCleanupHandler from "./form/ImageCleanupHandler";

/**
 * Props interface for CreatePhotoPageClient component
 * @property articles - List of available articles for photo association
 * @property image - Optional image data for edit mode
 */
interface CreatePhotoPageClientProps {
  articles: Article[];
  image?: Image; // Make image optional for create mode
}

/**
 * CreatePhotoPageClient Component
 * A form component for creating and editing photos with features for:
 * - File upload handling with validation
 * - Article association
 * - Description management
 * - Form state tracking
 * - Error handling with toast notifications
 * - Responsive layout with gradient styling
 */
export default function CreatePhotoPageClient({
  articles,
  image,
}: CreatePhotoPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    file: "",
    description: image?.description || "",
  });
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [isCleanupComplete, setIsCleanupComplete] = useState(false);
  const [isImageAvailable, setIsImageAvailable] = useState(true);

  // Determine if component is in edit mode
  const isEditMode = !!image;

  // Check if form is empty (required for create mode)
  const isFormEmpty = !selectedFile;

  // Check if the current image is available
  useEffect(() => {
    const checkImageAvailability = async () => {
      if (isEditMode && image?.image_url) {
        try {
          const img = new Image();
          const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(true);
            img.onerror = () => reject(new Error("Image failed to load"));
            setTimeout(() => reject(new Error("Image load timeout")), 5000);
          });

          img.src = image.image_url;
          await imageLoadPromise;
          setIsImageAvailable(true);
        } catch (error) {
          console.log("Image not available:", error);
          setIsImageAvailable(false);
        }
      }
    };

    checkImageAvailability();
  }, [isEditMode, image?.image_url]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Set previous image URL when in edit mode
  useEffect(() => {
    if (isEditMode && image?.image_url) {
      setPreviousImageUrl(image.image_url);
    }
  }, [isEditMode, image?.image_url]);

  // Handle cleanup completion
  const handleCleanupComplete = useCallback(() => {
    setIsCleanupComplete(true);
    setPreviousImageUrl(null);
  }, []);

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Handles success/error notifications and navigation
   */
  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      setUploadProgress(0);
      setIsImageProcessing(true);

      if (isEditMode && image) {
        // If a new file is selected, upload it first
        let imageUrl = image.image_url;
        if (selectedFile) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", selectedFile);
          uploadFormData.append(
            "description",
            formData.get("description") as string
          );
          uploadFormData.append(
            "article_id",
            formData.get("article_id") as string
          );

          // Simulate upload progress for file upload
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return prev + 10;
            });
          }, 200);

          const uploadResult = await uploadImageToServer(
            uploadFormData,
            true,
            image.id
          );
          clearInterval(progressInterval);
          setUploadProgress(100);

          if (uploadResult.error || !uploadResult.url) {
            throw new Error(uploadResult.error || "Failed to upload image");
          }

          // Set the new image URL and trigger cleanup of the old one
          imageUrl = uploadResult.url;
          // Store the old image URL for cleanup
          setPreviousImageUrl(image.image_url);
          // Reset cleanup completion state
          setIsCleanupComplete(false);
        }

        const articleId = formData.get("article_id")
          ? parseInt(formData.get("article_id") as string)
          : undefined;

        // Update the image record
        const updateResult = await updateImage(image.id, {
          image_url: imageUrl,
          description: formData.get("description") as string,
          type: "gallery",
          entity_type: articleId ? "article" : image.entity_type,
          entity_id: articleId || image.entity_id,
          is_featured: false,
          display_order: 0,
        });

        if (!updateResult.success) {
          throw new Error(
            updateResult.error || "Failed to update photo record"
          );
        }

        // Wait a bit to ensure cleanup has time to complete
        await new Promise((resolve) => setTimeout(resolve, 1000));

        showSuccessToast({ message: "Photo updated successfully" });
        router.refresh();
        router.push("/dashboard/photos");
      } else {
        // Simulate upload progress for new photos
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);

        const result = await uploadImageToServer(formData);
        clearInterval(progressInterval);
        setUploadProgress(100);

        if (result.error || !result.url) {
          throw new Error(result.error || "Failed to upload image");
        }

        showSuccessToast({ message: "Photo created successfully" });
        router.refresh();
        router.push("/dashboard/photos");
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} photo:`,
        error
      );
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : isEditMode
            ? "Failed to update photo"
            : "Failed to create photo",
      });
    } finally {
      // Ensure we reset all states after the operation is complete
      setIsSubmitting(false);
      setIsImageProcessing(false);
      setUploadProgress(0);
    }
  };

  /**
   * Input change handler
   * Updates form state when input values change
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * File input change handler
   * Updates selected file and form state
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormValues((prev) => ({
        ...prev,
        file: file.name,
      }));
      setIsImageProcessing(true);
      setUploadProgress(0);

      // Simulate upload progress for new file selection
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // After progress completes, show preview and toast
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Create preview URL after progress completes
        const filePreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(filePreviewUrl);
        showSuccessToast({ message: "Photo selected successfully" });

        // Reset processing state after a short delay
        setTimeout(() => {
          setIsImageProcessing(false);
          setUploadProgress(0);
        }, 500);
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      {/* Add ImageCleanupHandler */}
      {isEditMode && previousImageUrl && !isCleanupComplete && (
        <ImageCleanupHandler
          previousImageUrl={previousImageUrl}
          onCleanupComplete={handleCleanupComplete}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Form header with gradient background */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? "Edit Photo" : "Create New Photo"}
          </h2>
        </div>

        {/* Main form content */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          className="p-6 space-y-6"
        >
          <p className="text-xs text-gray-500">
            Fields marked with an asterisk (*) are required
          </p>

          <div className="space-y-6">
            {/* File upload field */}
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                Photo {!isEditMode && "*"}
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  required={!isEditMode}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
              {/* Photo preview */}
              {(isEditMode &&
                image?.image_url &&
                !previewUrl &&
                isImageAvailable) ||
              previewUrl ? (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {previewUrl ? "New Photo Preview" : "Current Photo"}
                  </h3>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={previewUrl || image?.image_url}
                      alt={image?.description || "Photo preview"}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </div>
                </div>
              ) : isEditMode && !isImageAvailable ? (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Current Photo
                  </h3>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Image not available
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
              {/* Upload progress bar */}
              {isImageProcessing && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-500" />
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {uploadProgress < 100
                          ? `Uploading... ${uploadProgress}%`
                          : "Processing image..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article selection field */}
            <div>
              <label
                htmlFor="article_id"
                className="block text-sm font-medium text-gray-700"
              >
                Article
              </label>
              <div className="mt-2">
                <select
                  id="article_id"
                  name="article_id"
                  defaultValue={image?.article_id || ""}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select an article (optional)</option>
                  {articles.map((article) => (
                    <option key={article.id} value={article.id}>
                      {article.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={8}
                  onChange={handleInputChange}
                  defaultValue={image?.description || ""}
                  placeholder="Enter photo description"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!isEditMode && isFormEmpty)}
              className="inline-flex justify-center items-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Photo"
              ) : (
                "Create Photo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
