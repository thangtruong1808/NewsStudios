"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VideoFormData, videoSchema } from "@/app/lib/validations/videoSchema";
import { Article } from "@/app/lib/definition";
import { createVideo } from "@/app/lib/actions/videos";
import VideoUpload from "./VideoUpload";
import { ArticleSelect } from "./ArticleSelect";
import { DescriptionField } from "./DescriptionField";
import { toast } from "react-hot-toast";

interface VideoFormProps {
  articles: Pick<Article, "id" | "title">[];
}

export default function VideoForm({ articles }: VideoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      article_id: 0,
      video_url: "",
      description: "",
    },
  });

  const articleId = watch("article_id");
  const description = watch("description") || "";

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    setValue("video_url", url);
  };

  const onSubmit = async (data: VideoFormData) => {
    try {
      setIsSubmitting(true);

      const result = await createVideo({
        article_id: data.article_id,
        video_url: data.video_url,
        description: data.description || undefined,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create video");
      }

      toast.success("Video created successfully!");
      router.push("/dashboard/videos");
      router.refresh();
    } catch (error) {
      console.error("Error creating video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create video"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800">
        <h2 className="text-xl font-semibold text-white">Upload New Video</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <ArticleSelect
            articles={articles}
            value={articleId}
            onChange={(value) => setValue("article_id", value)}
            error={errors.article_id?.message}
          />

          <VideoUpload
            onVideoUrlChange={handleVideoUrlChange}
            error={errors.video_url?.message}
          />

          <DescriptionField
            value={description}
            onChange={(value) => setValue("description", value)}
            error={errors.description?.message}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/videos")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Create Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
