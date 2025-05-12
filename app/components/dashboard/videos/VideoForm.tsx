"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VideoFormData, videoSchema } from "@/app/lib/validations/videoSchema";
import { Article, Video } from "@/app/lib/definition";
import { createVideo, updateVideo } from "@/app/lib/actions/videos";
import VideoUpload from "./VideoUpload";
import ArticleSelect from "./ArticleSelect";
import { DescriptionField } from "./DescriptionField";
import { toast } from "react-hot-toast";
import {
  PencilIcon,
  XMarkIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface VideoFormProps {
  articles: Pick<Article, "id" | "title">[];
  video?: Video;
}

export default function VideoForm({ articles, video }: VideoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>(video?.video_url || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      article_id: video?.article_id || 0,
      video_url: video?.video_url || "",
      description: video?.description || "",
    },
  });

  useEffect(() => {
    if (video) {
      setValue("article_id", video.article_id);
      setValue("video_url", video.video_url || "");
      setValue("description", video.description || "");
      setVideoUrl(video.video_url || "");
    }
  }, [video, setValue]);

  const articleId = watch("article_id");
  const description = watch("description") || "";

  const handleVideoUrlChange = (url: string) => {
    console.log("Video URL changed:", url);
    setVideoUrl(url);
    setValue("video_url", url);
  };

  const onSubmit = async (data: VideoFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form data:", data);

      if (!data.video_url) {
        throw new Error("Video URL is required");
      }

      if (!data.article_id) {
        throw new Error("Article ID is required");
      }

      let result;
      if (video) {
        // Update existing video
        result = await updateVideo(video.id, {
          article_id: data.article_id,
          video_url: data.video_url,
          description: data.description || undefined,
        });
      } else {
        // Create new video
        result = await createVideo({
          article_id: data.article_id,
          video_url: data.video_url,
          description: data.description || undefined,
        });
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(
        video ? "Video updated successfully!" : "Video created successfully!"
      );
      router.push("/dashboard/videos");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save video"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {video ? "Edit Video" : "Upload New Video"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <ArticleSelect
            articles={articles}
            selectedArticleId={articleId || null}
            onArticleChange={(value) => setValue("article_id", value || 0)}
            error={errors.article_id?.message}
          />

          <VideoUpload
            onVideoUrlChange={handleVideoUrlChange}
            error={errors.video_url?.message}
          />

          <DescriptionField
            value={description}
            onChange={(value: string) => setValue("description", value)}
            error={errors.description?.message}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/videos")}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
