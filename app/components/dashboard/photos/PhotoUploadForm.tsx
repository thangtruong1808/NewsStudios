"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToServer, updateImage } from "@/app/lib/actions/images";
import { toast } from "react-hot-toast";
import { Article, Image } from "../../../lib/definition";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface PhotoUploadFormProps {
  articles: Article[];
  image?: Image;
}

export default function PhotoUploadForm({
  articles,
  image,
}: PhotoUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(
    image?.article_id || null
  );
  const [description, setDescription] = useState(image?.description || "");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    image?.image_url || null
  );

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
    setLoading(true);
    const toastId = toast.loading(
      image ? "Updating photo..." : "Uploading image..."
    );

    try {
      if (image) {
        // Update existing image
        const formData = new FormData();
        if (file) {
          formData.append("file", file);
        }
        if (selectedArticle) {
          formData.append("article_id", selectedArticle.toString());
        }
        if (description) {
          formData.append("description", description);
        }

        const result = await uploadImageToServer(formData);

        if (result.error) {
          toast.error(`Update failed: ${result.error}`, { id: toastId });
          return;
        }

        toast.success("Photo updated successfully", { id: toastId });
      } else {
        // Upload new image
        if (!file) {
          toast.error("Please select a file", { id: toastId });
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Please select an image file", { id: toastId });
          return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB", { id: toastId });
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        if (selectedArticle) {
          formData.append("article_id", selectedArticle.toString());
        }
        if (description) {
          formData.append("description", description);
        }

        const result = await uploadImageToServer(formData);

        if (result.error) {
          toast.error(`Upload failed: ${result.error}`, { id: toastId });
          return;
        }

        toast.success("Image uploaded successfully", { id: toastId });
      }

      // Reset form
      setFile(null);
      setSelectedArticle(null);
      setDescription("");
      setPreviewUrl(null);

      // Redirect to photos page
      router.push("/dashboard/photos");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `An error occurred while ${image ? "updating" : "uploading"} the image`,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {image ? "Edit Photo" : "Upload New Photo"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Required Fields Note */}
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              {image ? "Change Image" : "Select Image"}{" "}
              <span className="text-red-500">*</span>
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
              id="article_id"
              value={selectedArticle || ""}
              onChange={(e) =>
                setSelectedArticle(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
            >
              <option value="">Select an article</option>
              {Array.isArray(articles)
                ? articles.map((article) => (
                    <option key={article.id} value={article.id}>
                      {article.title}
                    </option>
                  ))
                : null}
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
              placeholder="Enter a description for this image"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/photos")}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (!image && !file)}
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50"
          >
            {loading ? (
              image ? (
                "Updating..."
              ) : (
                "Submitting..."
              )
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                {image ? "Update" : "Submit"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
