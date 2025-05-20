"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  getPublicIdFromUrl,
  deleteImage,
} from "@/app/lib/utils/cloudinaryUtils";
import { showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

interface ImageCleanupHandlerProps {
  previousImageUrl: string | null;
  onCleanupComplete: () => void;
}

/**
 * ImageCleanupHandler Component
 * Handles cleanup of old images when a new image is uploaded in edit mode
 */
export default function ImageCleanupHandler({
  previousImageUrl,
  onCleanupComplete,
}: ImageCleanupHandlerProps) {
  const [isCleaning, setIsCleaning] = useState(false);
  const cleanupAttempted = useRef(false);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const cleanupImage = useCallback(async () => {
    // Prevent multiple cleanup attempts
    if (!previousImageUrl || isCleaning || cleanupAttempted.current) {
      return;
    }

    try {
      setIsCleaning(true);
      cleanupAttempted.current = true;
      console.log("Starting cleanup for image:", previousImageUrl);

      const publicId = getPublicIdFromUrl(previousImageUrl);
      console.log("Extracted public ID:", publicId);

      if (!publicId) {
        console.error(
          "Failed to extract public ID from URL:",
          previousImageUrl
        );
        if (isMounted.current) {
          showErrorToast({ message: "Failed to extract image ID for cleanup" });
        }
        onCleanupComplete();
        return;
      }

      console.log("Attempting to delete image with public ID:", publicId);
      const result = await deleteImage(publicId);
      console.log("Delete result:", result);

      if (!result.success) {
        console.error("Failed to delete image:", result.error);
        if (isMounted.current) {
          showErrorToast({ message: "Failed to clean up old image" });
        }
        onCleanupComplete();
        return;
      }

      console.log("Successfully cleaned up old image");
      // Only call onCleanupComplete if component is still mounted
      if (isMounted.current) {
        onCleanupComplete();
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
      if (isMounted.current) {
        showErrorToast({ message: "Failed to clean up old image" });
      }
      onCleanupComplete();
    } finally {
      if (isMounted.current) {
        setIsCleaning(false);
      }
    }
  }, [previousImageUrl, onCleanupComplete]);

  // Automatically trigger cleanup when component mounts
  useEffect(() => {
    if (previousImageUrl && !isCleaning && !cleanupAttempted.current) {
      console.log("Triggering cleanup for image:", previousImageUrl);
      cleanupImage();
    }
  }, [previousImageUrl, isCleaning, cleanupImage]);

  return null; // This is a utility component, no UI needed
}
