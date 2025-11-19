"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/app/lib/definition";
import { toast } from "react-hot-toast";

interface VideoUploadFormProps {
  articles: Article[];
  video?: {
    id: number;
    video_url: string;
    article_id: number | null;
    description: string | null;
  };
}

export default function VideoUploadForm({
  articles,
  video,
}: VideoUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [articleId, setArticleId] = useState<number | null>(
    video?.article_id || null
  );
  const [description, setDescription] = useState(video?.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (videoFile) {
        formData.append("video", videoFile);
      }
      if (articleId) {
        formData.append("article_id", articleId.toString());
      }
      if (description) {
        formData.append("description", description);
      }

      const url = video ? `/api/videos/${video.id}` : "/api/videos";
      const method = video ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save video");
      }

      toast.success(
        video ? "Video updated successfully" : "Video uploaded successfully"
      );
      router.push("/dashboard/videos");
      router.refresh();
    } catch {
      toast.error("Failed to save video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Video File
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
          required={!video}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Associated Article
        </label>
        <select
          value={articleId || ""}
          onChange={(e) =>
            setArticleId(e.target.value ? Number(e.target.value) : null)
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an article</option>
          {articles.map((article) => (
            <option key={article.id} value={article.id}>
              {article.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? "Saving..." : video ? "Update" : "Upload"}
        </button>
      </div>
    </form>
  );
}
