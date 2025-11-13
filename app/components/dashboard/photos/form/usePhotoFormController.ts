"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Image } from "@/app/lib/definition";
import { createImage, updateImage } from "@/app/lib/actions/images";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryUtils";
import {
  showErrorToast,
  showSuccessToast,
} from "@/app/components/dashboard/shared/toast/Toast";

interface UsePhotoFormControllerParams {
  image?: Image;
  mode: "create" | "edit";
}

interface PhotoFormValues {
  file: File | null;
  description: string;
  articleId: string;
}

/* eslint-disable no-unused-vars */
interface UsePhotoFormControllerReturn {
  formValues: PhotoFormValues;
  isSubmitting: boolean;
  uploadProgress: number;
  isImageProcessing: boolean;
  previewUrl: string | null;
  isFormEmpty: boolean;
  isImageAvailable: boolean;
  previousImageUrl: string | null;
  isCleanupComplete: boolean;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  handleInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleClearFile: () => void;
  handleCleanupComplete: () => void;
}
/* eslint-enable no-unused-vars */

// Description: Manage state, validation, and submission logic for the photo dashboard form.
// Data created: Form inputs, file upload handling, Cloudinary side effects, and cleanup tracking.
// Author: thangtruong
export function usePhotoFormController({
  image,
  mode,
}: UsePhotoFormControllerParams): UsePhotoFormControllerReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [isCleanupComplete, setIsCleanupComplete] = useState(true);
  const [formValues, setFormValues] = useState<PhotoFormValues>({
    file: null,
    description: image?.description || "",
    articleId: image?.article_id?.toString() || "",
  });

  useEffect(() => {
    if (image) {
      setFormValues({
        description: image.description || "",
        articleId: image.article_id?.toString() || "",
        file: null,
      });
    }
  }, [image]);

  const isFormEmpty = useMemo(
    () => !formValues.file && !image?.image_url,
    [formValues.file, image?.image_url]
  );

  const isImageAvailable = useMemo(
    () => Boolean(image?.image_url),
    [image?.image_url]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        if (!formValues.description) {
          showErrorToast({ message: "Please provide a description" });
          return;
        }

        if (mode === "create" && !selectedFile) {
          showErrorToast({ message: "Please select an image file" });
          return;
        }

        let imageUrl = image?.image_url;

        if (selectedFile) {
          const uploadResult = await uploadToCloudinary(selectedFile, "image");
          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || "Failed to upload image");
          }
          imageUrl = uploadResult.url;

          if (mode === "edit" && image?.image_url) {
            setPreviousImageUrl(image.image_url);
            setIsCleanupComplete(false);
          }
        }

        if (!imageUrl) {
          throw new Error("Image URL is required");
        }

        const articleIdValue = formValues.articleId
          ? Number.parseInt(formValues.articleId, 10)
          : 0;

        if (mode === "create") {
          const createResult = await createImage({
            image_url: imageUrl,
            description: formValues.description,
            type: "gallery",
            entity_type: "article",
            entity_id: articleIdValue,
            is_featured: false,
            display_order: 0,
            article_id: formValues.articleId
              ? Number.parseInt(formValues.articleId, 10)
              : null,
          });

          if (!createResult.success) {
            throw new Error(createResult.error || "Failed to create photo");
          }
          showSuccessToast({ message: "Photo created successfully" });
        } else if (image?.id) {
          await updateImage(image.id, {
            image_url: imageUrl,
            description: formValues.description,
            type: "gallery",
            entity_type: "article",
            entity_id: articleIdValue,
            is_featured: false,
            display_order: 0,
            article_id: formValues.articleId
              ? Number.parseInt(formValues.articleId, 10)
              : null,
          });
          showSuccessToast({ message: "Photo updated successfully" });
        }

        router.push("/dashboard/photos");
        router.refresh();
      } catch (error) {
        showErrorToast({
          message:
            error instanceof Error ? error.message : "An error occurred while saving the photo",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formValues.articleId,
      formValues.description,
      image,
      mode,
      router,
      selectedFile,
    ]
  );

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = event.target;
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsImageProcessing(true);
      setUploadProgress(0);

      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select an image file");
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Image size should be less than 10MB");
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        setFormValues((prev) => ({
          ...prev,
          file,
        }));

        setSelectedFile(file);
        showSuccessToast({ message: "Image selected successfully" });
      } catch (error) {
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
    },
    []
  );

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormValues((prev) => ({
      ...prev,
      file: null,
    }));
  }, []);

  const handleCleanupComplete = useCallback(() => {
    setIsCleanupComplete(true);
  }, []);

  return {
    formValues,
    isSubmitting,
    uploadProgress,
    isImageProcessing,
    previewUrl,
    isFormEmpty,
    isImageAvailable,
    previousImageUrl,
    isCleanupComplete,
    handleSubmit,
    handleInputChange,
    handleFileChange,
    handleClearFile,
    handleCleanupComplete,
  };
}

