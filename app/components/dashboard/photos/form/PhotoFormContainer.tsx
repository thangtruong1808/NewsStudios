"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Article, Image } from "@/app/lib/definition";
import { uploadImageToServer, updateImage } from "@/app/lib/actions/images";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import ImageCleanupHandler from "./ImageCleanupHandler";
import { PhotoForm } from "./PhotoForm";

/**
 * Props interface for PhotoFormContainer component
 * @property articles - List of available articles for photo association
 * @property image - Optional image data for edit mode
 */
interface PhotoFormContainerProps {
  articles: Article[];
  image?: Image;
}

/**
 * PhotoFormContainer Component
 * Container component that manages form state and submission logic
 */
export default function PhotoFormContainer({
  articles,
  image,
}: PhotoFormContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    file: "",
    description: image?.description || "",
    articleId: image?.article_id?.toString() || "",
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

  // Update form values when image changes
  useEffect(() => {
    if (image) {
      setFormValues((prev) => ({
        ...prev,
        description: image.description || "",
        articleId: image.article_id?.toString() || "",
      }));
    }
  }, [image]);

  // Handle cleanup completion
  const handleCleanupComplete = useCallback(() => {
    setIsCleanupComplete(true);
    setPreviousImageUrl(null);
  }, []);

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   */
  const handleSubmit = async (e: React.FormEvent<Element>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      setIsSubmitting(true);

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

          const uploadResult = await uploadImageToServer(
            uploadFormData,
            true,
            image.id
          );

          if (uploadResult.error || !uploadResult.url) {
            throw new Error(uploadResult.error || "Failed to upload image");
          }

          // Set the new image URL and trigger cleanup of the old one
          imageUrl = uploadResult.url;
          setPreviousImageUrl(image.image_url);
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

        await new Promise((resolve) => setTimeout(resolve, 1000));

        showSuccessToast({ message: "Photo updated successfully" });
        router.refresh();
        router.push("/dashboard/photos");
      } else {
        const result = await uploadImageToServer(formData);

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  /**
   * Clear file handler
   */
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="w-full">
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

      {previousImageUrl && !isCleanupComplete && (
        <ImageCleanupHandler
          previousImageUrl={previousImageUrl}
          onCleanupComplete={handleCleanupComplete}
        />
      )}
    </div>
  );
}
