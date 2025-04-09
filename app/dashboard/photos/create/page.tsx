"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToServer } from "../../../lib/actions/images";
import toast from "react-hot-toast";

export default function CreatePhotoPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleArticleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleId(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);

    try {
      // Convert articleId to number or null
      const articleIdNumber = articleId ? parseInt(articleId, 10) : null;

      const { url, error } = await uploadImageToServer(
        selectedFile,
        articleIdNumber,
        description || null
      );

      if (error) {
        toast.error(error);
      } else {
        toast.success("Photo uploaded successfully");
        router.push("/dashboard/photos");
        router.refresh();
      }
    } catch (err) {
      toast.error("Failed to upload photo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Upload New Photo</h1>
      </div>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Article ID (Optional)
            </label>
            <input
              type="number"
              value={articleId}
              onChange={handleArticleIdChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Leave empty if not associated with an article"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              If you want to associate this photo with an article, enter the
              article ID here.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter a description for this photo"
              rows={3}
              disabled={loading}
            />
          </div>

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
              <div className="relative w-full h-64 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/photos")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading || !selectedFile}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
