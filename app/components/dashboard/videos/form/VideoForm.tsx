"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo, updateVideo } from "@/app/lib/actions/videos";
import { Video } from "@/app/lib/definition";
import VideoUpload from "./fields/VideoUpload";
import ArticleSelect from "./fields/ArticleSelect";
import DescriptionField from "./fields/DescriptionField";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/**
 * Props interface for VideoForm component
 * @property video - Optional video data for edit mode
 * @property mode - Form mode: "create" or "edit"
 */
interface VideoFormProps {
  video?: Video;
  mode: "create" | "edit";
}

/**
 * VideoForm Component
 * A form component for creating and editing videos with features for:
 * - Video file upload handling
 * - Article association
 * - Description management
 * - Form state tracking
 * - Error handling with toast notifications
 * - Responsive layout with consistent styling
 */
export default function VideoForm({ video, mode }: VideoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    article_id: video?.article_id || 0,
    video_url: video?.video_url || "",
    description: video?.description || "",
  });

  // Check if form is empty
  const isFormEmpty = !formData.video_url.trim();

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Handles success/error notifications and navigation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const result = await createVideo({
          ...formData,
          article_id: formData.article_id || 0,
        });
        if (result.error) {
          throw new Error(result.error);
        }
        showSuccessToast({ message: "Video created successfully" });
        router.push("/dashboard/videos");
      } else if (mode === "edit" && video) {
        const result = await updateVideo(video.id, formData);
        if (result.error) {
          throw new Error(result.error);
        }
        showSuccessToast({ message: "Video updated successfully" });
        router.push("/dashboard/videos");
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to submit video",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Article selection field */}
        <ArticleSelect
          value={formData.article_id}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, article_id: value || 0 }))
          }
        />

        {/* Video upload field */}
        <VideoUpload
          value={formData.video_url}
          onChange={(url) =>
            setFormData((prev) => ({ ...prev, video_url: url }))
          }
        />

        {/* Description field */}
        <DescriptionField
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
        />
      </div>

      {/* Form action buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (!mode.includes("edit") && isFormEmpty)}
          className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Create Video"
            : "Update Video"}
        </button>
      </div>
    </form>
  );
}
