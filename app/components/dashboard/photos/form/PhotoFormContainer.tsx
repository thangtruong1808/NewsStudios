"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Article, Image } from "@/app/lib/definition";
import { createImage, updateImage } from "@/app/lib/actions/images";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import ImageCleanupHandler from "./ImageCleanupHandler";
import PhotoForm from "./PhotoForm";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryUtils";

/**
 * Props interface for PhotoFormContainer component
 * @property articles - List of available articles for photo association
 * @property image - Optional image data for edit mode
 * @property mode - The mode of the form ("create" or "edit")
 */
interface PhotoFormContainerProps {
  articles: Article[];
  image?: Image;
  mode: "create" | "edit";
}

/**
 * PhotoFormContainer Component
 * Container component that manages form state and submission logic
 */
export default function PhotoFormContainer({
  articles,
  image,
  mode,
}: PhotoFormContainerProps) {
  console.log("PhotoFormContainer received articles:", articles);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [isCleanupComplete, setIsCleanupComplete] = useState(true);
  const [formValues, setFormValues] = useState({
    file: null as File | null,
    description: image?.description || "",
    articleId: image?.article_id?.toString() || "",
  });

  // Check if form is empty
  const isFormEmpty = !formValues.file && !image?.image_url;

  // Check if image is available
  const isImageAvailable = !!image?.image_url;

  // Debug log for initial form values
  useEffect(() => {
    console.log("Initial form values:", formValues);
    console.log("Available articles:", articles);
  }, [articles, formValues]);

  // Update form values when image changes
  useEffect(() => {
    if (image) {
      setFormValues({
        description: image.description || "",
        articleId: image.article_id?.toString() || "",
        file: null,
      });
    }
  }, [image]);

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formValues.description) {
        showErrorToast({ message: "Please provide a description" });
        return;
      }

      if (mode === "create" && !selectedFile) {
        showErrorToast({ message: "Please select an image file" });
        return;
      }

      let imageUrl = image?.image_url;

      // If there's a new file selected, upload it to Cloudinary
      if (selectedFile) {
        const result = await uploadToCloudinary(selectedFile, "image");
        if (!result.success || !result.url) {
          throw new Error(result.error || "Failed to upload image");
        }
        imageUrl = result.url;

        // Store previous image URL for cleanup
        if (mode === "edit" && image?.image_url) {
          setPreviousImageUrl(image.image_url);
          setIsCleanupComplete(false);
        }
      }

      if (!imageUrl) {
        throw new Error("Image URL is required");
      }

      const entityId = formValues.articleId
        ? parseInt(formValues.articleId)
        : 0;

      if (mode === "create") {
        const result = await createImage({
          image_url: imageUrl,
          description: formValues.description,
          type: "gallery",
          entity_type: "article",
          entity_id: entityId,
          is_featured: false,
          display_order: 0,
          article_id: formValues.articleId
            ? parseInt(formValues.articleId)
            : null,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create photo");
        }
        showSuccessToast({ message: "Photo created successfully" });
      } else if (image?.id) {
        await updateImage(image.id, {
          image_url: imageUrl,
          description: formValues.description,
          type: "gallery",
          entity_type: "article",
          entity_id: entityId,
          is_featured: false,
          display_order: 0,
          article_id: formValues.articleId
            ? parseInt(formValues.articleId)
            : null,
        });
        showSuccessToast({ message: "Photo updated successfully" });
      }

      router.push("/dashboard/photos");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorToast({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Input change handler
   */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * File change handler
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageProcessing(true);
    setUploadProgress(0);

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size should be less than 10MB");
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Update form values
      setFormValues((prev) => ({
        ...prev,
        file,
      }));

      setSelectedFile(file);
      showSuccessToast({ message: "Image selected successfully" });
    } catch (error) {
      console.error("Error processing image:", error);
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to process image",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    } finally {
      setIsImageProcessing(false);
      setUploadProgress(0);
    }
  };

  /**
   * Clear file handler
   */
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormValues((prev) => ({
      ...prev,
      file: null,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <PhotoIcon className="h-8 w-8" />
          {mode === "create" ? "Create New Photo" : "Edit Photo"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {mode === "edit"
            ? "Update the photo's information below."
            : "Fill in the photo's information below."}
        </p>
      </div>

      {/* Main form content */}
      <div className="p-6">
        <p className="text-xs mb-6">
          Fields marked with an asterisk (*) are required
        </p>
        <PhotoForm
          articles={articles}
          image={image}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          isImageProcessing={isImageProcessing}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          formValues={formValues}
          isFormEmpty={isFormEmpty}
          isImageAvailable={isImageAvailable}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onClearFile={handleClearFile}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/dashboard/photos")}
        />
      </div>

      {previousImageUrl && !isCleanupComplete && (
        <ImageCleanupHandler
          previousImageUrl={previousImageUrl}
          onCleanupComplete={() => setIsCleanupComplete(true)}
        />
      )}
    </div>
  );
}
