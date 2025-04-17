"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToServer } from "@/app/lib/actions/images";
import { toast } from "react-hot-toast";
import { Article } from "../../../lib/definition";
import { query } from "../../../lib/db/db";

export default function PhotoUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await query(
          "SELECT id, title FROM Articles ORDER BY title"
        );
        if (result.error) {
          toast.error("Failed to fetch articles");
          return;
        }
        setArticles(result.data as Article[]);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to fetch articles");
      }
    };

    fetchArticles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // Clean up the object URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (selectedArticle) {
        formData.append("article_id", selectedArticle.toString());
      }
      if (description) {
        formData.append("description", description);
      }

      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
        articleId: selectedArticle,
        description: description,
      });

      const result = await uploadImageToServer(formData);

      if (result.error) {
        toast.error(`Upload failed: ${result.error}`, { id: toastId });
        return;
      }

      toast.success("Image uploaded successfully to Cloudinary", {
        id: toastId,
      });
      setFile(null);
      setSelectedArticle(null);
      setDescription("");
      setPreviewUrl(null);
      // Reset file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh the page to show the new image
      router.refresh();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Select Image
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>

        {previewUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 rounded-md border border-gray-300"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="article"
            className="block text-sm font-medium text-gray-700"
          >
            Associate with Article (Optional)
          </label>
          <select
            id="article"
            value={selectedArticle || ""}
            onChange={(e) =>
              setSelectedArticle(e.target.value ? Number(e.target.value) : null)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
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
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !file}
            className="px-4 py-2 bg-violet-600 text-white rounded-md text-sm font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>
    </div>
  );
}
