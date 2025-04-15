"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  imageSchema,
  type ImageFormData,
} from "../../../lib/validations/imageSchema";
import { createImage, uploadImageToServer } from "../../../lib/actions/images";
import toast from "react-hot-toast";

interface ImageFormProps {
  articleId?: number | null;
}

export default function ImageForm({ articleId }: ImageFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageAlreadySaved, setImageAlreadySaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      article_id: articleId || null,
      image_url: "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to server
    setIsUploading(true);
    try {
      // Create a FormData object from the File
      const formData = new FormData();
      formData.append("file", file);

      const { url, error } = await uploadImageToServer(formData);
      if (error) {
        setError(error);
        toast.error(error);
      } else if (url) {
        // Extract just the filename from the URL for storage
        const urlParts = url.split("/");
        const filename = urlParts[urlParts.length - 1];
        setValue("image_url", filename);
        toast.success("Image uploaded successfully");
        // Image is now saved in the database, we can redirect
        setImageAlreadySaved(true);
      }
    } catch (err) {
      setError("Failed to upload image");
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ImageFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // If the image was already saved during upload, just redirect
      if (imageAlreadySaved) {
        router.push("/dashboard/photos");
        router.refresh();
        return;
      }

      const { error } = await createImage(data);
      if (error) {
        setError(error);
        toast.error(error);
      } else {
        toast.success("Image saved successfully");
        router.push("/dashboard/photos");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Image
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            disabled={isUploading}
          />
        </div>
        {isUploading && (
          <p className="mt-1 text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      {previewUrl && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-1 h-40 w-auto object-contain border border-gray-200 rounded"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="text"
          id="image_url"
          {...register("image_url")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Image URL will be populated after upload"
          readOnly
        />
        {errors.image_url && (
          <p className="mt-1 text-sm text-red-600">
            {errors.image_url.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="article_id"
          className="block text-sm font-medium text-gray-700"
        >
          Article ID (Optional)
        </label>
        <input
          type="number"
          id="article_id"
          {...register("article_id", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Leave empty if not associated with an article"
        />
        {errors.article_id && (
          <p className="mt-1 text-sm text-red-600">
            {errors.article_id.message}
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/photos")}
          className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Image"}
        </button>
      </div>
    </form>
  );
}
