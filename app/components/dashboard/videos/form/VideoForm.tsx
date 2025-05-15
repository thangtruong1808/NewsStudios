"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createVideo, updateVideo } from "@/app/lib/actions/videos";
import { Video } from "@/app/lib/definition";
import VideoUpload from "./fields/VideoUpload";
import ArticleSelect from "./fields/ArticleSelect";
import { DescriptionField } from "./fields/DescriptionField";

interface VideoFormProps {
  video?: Video;
  mode: "create" | "edit";
}

export default function VideoForm({ video, mode }: VideoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    article_id: video?.article_id || null,
    video_url: video?.video_url || "",
    description: video?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const result = await createVideo(formData);
        if (result.error) {
          throw new Error(result.error);
        }
        toast.success("Video created successfully");
        router.push("/dashboard/videos");
      } else if (mode === "edit" && video) {
        const result = await updateVideo(video.id, formData);
        if (result.error) {
          throw new Error(result.error);
        }
        toast.success("Video updated successfully");
        router.push("/dashboard/videos");
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit video"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <ArticleSelect
          value={formData.article_id}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, article_id: value }))
          }
        />

        <VideoUpload
          value={formData.video_url}
          onChange={(url) =>
            setFormData((prev) => ({ ...prev, video_url: url }))
          }
        />

        <DescriptionField
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
