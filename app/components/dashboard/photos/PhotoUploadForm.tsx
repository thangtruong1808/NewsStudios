"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToServer } from "../../../lib/actions/images";
import toast from "react-hot-toast";
import { Article } from "../../../lib/definition";

interface PhotoUploadFormProps {
  articles: Article[];
}

export default function PhotoUploadForm({ articles }: PhotoUploadFormProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleArticleIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArticleId(e.target.value);
    // If an article is selected, use its title as the default description if no description is set
    if (e.target.value && !description) {
      const selectedArticle = articles.find(
        (a) => a.id.toString() === e.target.value
      );
      if (selectedArticle) {
        setDescription(selectedArticle.title);
      }
    }
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

      // Create a FormData object to properly handle the file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(
        "article_id",
        articleIdNumber ? articleIdNumber.toString() : ""
      );
      formData.append("description", description || "");

      const { url, error } = await uploadImageToServer(formData);

      if (error) {
        toast.error(error);
      } else {
        toast.success("Photo uploaded successfully");
        setUploadSuccess(true);
      }
    } catch (err) {
      toast.error("Failed to upload photo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uploadSuccess) {
      router.push("/dashboard/photos");
      router.refresh();
    }
  }, [uploadSuccess, router]);

  const handleCancel = () => {
    router.push("/dashboard/photos");
  };

  return (
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
            Associated Article (Optional)
          </label>
          <select
            value={articleId}
            onChange={handleArticleIdChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          >
            <option value="">Select an article</option>
            {articles.map((article) => (
              <option key={article.id} value={article.id}>
                {article.title}{" "}
                {article.author_name ? `(by ${article.author_name})` : ""}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select an article to associate with this photo. The article's title
            will be used as the default description.
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
            onClick={handleCancel}
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
  );
}
