"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Video } from "../../../login/login-definitions";
import { createVideo, updateVideo } from "../../../lib/actions/videos";
import { getArticles, Article } from "../../../lib/actions/articles";
import { useRouter } from "next/navigation";

const videoSchema = z.object({
  article_id: z.number().min(1, "Article is required"),
  video_url: z.string().url("Must be a valid URL"),
  description: z.string().nullable(),
});

type VideoFormData = z.infer<typeof videoSchema>;

interface ArticleOption {
  id: number;
  title: string;
}

interface VideoFormProps {
  video?: Video;
  onSuccess?: () => void;
}

export default function VideoForm({ video, onSuccess }: VideoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      article_id: video?.article_id || 0,
      video_url: video?.video_url || "",
      description: video?.description || "",
    },
  });

  // Fetch articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoadingArticles(true);
        const result = await getArticles();
        if (result.error) {
          setArticlesError(result.error);
          return;
        }
        if (!result.data || !Array.isArray(result.data)) {
          setArticlesError("No articles found");
          return;
        }
        const formattedArticles = result.data.map((article: any) => ({
          id: Number(article.id),
          title: String(article.title || "Untitled Article"),
        }));
        setArticles(formattedArticles);
      } catch (error) {
        setArticlesError("Failed to fetch articles");
        console.error(error);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

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
      const result = video
        ? await updateVideo(video.id, data)
        : await createVideo(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (!result.data) {
        toast.error("Failed to save video");
        return;
      }

      toast.success(`Video ${video ? "updated" : "created"} successfully!`);
      router.push("/dashboard/videos");
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
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
        {isLoadingArticles ? (
          <div className="mt-1 text-sm text-gray-500">Loading articles...</div>
        ) : articlesError ? (
          <div className="mt-1 text-sm text-red-600">
            {articlesError}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Retry
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="mt-1 text-sm text-amber-600">
            No articles available. Please create an article first.
          </div>
        ) : (
          <select
            id="article_id"
            {...register("article_id", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue={video?.article_id || ""}
          >
            <option value="">Select an article</option>
            {articles.map((article) => (
              <option key={article.id} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>
        )}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          disabled={isLoading || isLoadingArticles || articles.length === 0}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : video ? "Update Video" : "Create Video"}
        </button>
      </div>
    </form>
  );
}
