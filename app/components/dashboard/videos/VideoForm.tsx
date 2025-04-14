"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Video, Article } from "../../../lib/definition";
import { createVideo, updateVideo } from "../../../lib/actions/videos";
import { getArticles } from "../../../lib/actions/articles";
import { useRouter } from "next/navigation";

const videoSchema = z.object({
  article_id: z.number().min(1, "Article is required"),
  video_url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
});

type VideoFormData = z.infer<typeof videoSchema>;

interface ArticleOption {
  id: number;
  title: string;
}

interface VideoFormProps {
  video?: Video;
  articles: Article[];
}

export default function VideoForm({ video, articles }: VideoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: video || {
      article_id: 0,
      video_url: "",
      description: "",
    },
  });

  useEffect(() => {
    if (video) {
      reset({
        article_id: video.article_id,
        video_url: video.video_url,
        description: video.description || "",
      });
    }
  }, [video, reset]);

  const onSubmit = async (data: VideoFormData) => {
    try {
      if (video) {
        await updateVideo(video.id, data);
        toast.success("Video updated successfully");
      } else {
        await createVideo(data);
        toast.success("Video created successfully");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="article_id"
          className="block text-sm font-medium text-gray-700"
        >
          Article
        </label>
        <select
          id="article_id"
          {...register("article_id", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an article</option>
          {articles.map((article) => (
            <option key={article.id} value={article.id}>
              {article.title}
            </option>
          ))}
        </select>
        {errors.article_id && (
          <p className="mt-1 text-sm text-red-600">
            {errors.article_id.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="video_url"
          className="block text-sm font-medium text-gray-700"
        >
          Video URL
        </label>
        <input
          type="text"
          id="video_url"
          {...register("video_url")}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.video_url && (
          <p className="mt-1 text-sm text-red-600">
            {errors.video_url.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {video ? "Update" : "Create"} Video
        </button>
      </div>
    </form>
  );
}
