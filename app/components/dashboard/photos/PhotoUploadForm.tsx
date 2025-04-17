"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToServer } from "@/app/lib/actions/images";
import { toast } from "react-hot-toast";
import { Article } from "../../../lib/definition";

interface PhotoUploadFormProps {
  articles: Article[];
}

export default function PhotoUploadForm({ articles }: PhotoUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

      // Reset form
      setFile(null);
      setSelectedArticle(null);
      setDescription("");
      setPreviewUrl(null);

      // Redirect to photos page
      router.push("/dashboard/photos");
      router.refresh();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Select Image
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        {previewUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">Preview:</p>
            <div className="mt-1 relative h-48 w-48 overflow-hidden rounded-md">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="article"
            className="block text-sm font-medium text-gray-700"
          >
            Associated Article (Optional)
          </label>
          <select
            id="article"
            name="article"
            value={selectedArticle || ""}
            onChange={(e) =>
              setSelectedArticle(e.target.value ? Number(e.target.value) : null)
            }
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter a description for this image"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !file}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
}
