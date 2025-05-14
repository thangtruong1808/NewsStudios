"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Article, Image } from "@/app/lib/definition";
import { toast } from "react-hot-toast";

interface PhotoUploadFormProps {
  articles: Article[];
  image: Image;
}

export default function PhotoUploadForm({
  articles,
  image,
}: PhotoUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/photos/${image.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update photo");
      }

      toast.success("Photo updated successfully");
      router.push("/dashboard/photos");
      router.refresh();
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">Edit Photo</h2>
      </div>

      <form action={handleSubmit} className="p-6 space-y-6">
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Photo
          </label>
          <div className="mt-2">
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="article_id"
            className="block text-sm font-medium text-gray-700"
          >
            Article
          </label>
          <div className="mt-2">
            <select
              id="article_id"
              name="article_id"
              defaultValue={image.article_id || ""}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select an article (optional)</option>
              {articles.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={image.description || ""}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Photo"}
          </button>
        </div>
      </form>
    </div>
  );
}
