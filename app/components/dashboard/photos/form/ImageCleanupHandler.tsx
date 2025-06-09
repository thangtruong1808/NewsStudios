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

      const publicId = getPublicIdFromUrl(previousImageUrl);

      if (!publicId) {
        if (isMounted.current) {
          showErrorToast({ message: "Failed to extract image ID for cleanup" });
        }
        onCleanupComplete();
        return;
      }

      const result = await deleteImage(publicId);

      if (!result.success) {
        if (isMounted.current) {
          showErrorToast({ message: "Failed to clean up old image" });
        }
        onCleanupComplete();
        return;
      }

      if (isMounted.current) {
        onCleanupComplete();
      }
    } catch (error) {
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
      cleanupImage();
    }
  }, [previousImageUrl, isCleaning, cleanupImage]);

  return null; // This is a utility component, no UI needed
}
