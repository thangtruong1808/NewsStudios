"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Advertisement,
  Sponsor,
  Article,
  Category,
} from "@/app/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  advertisementSchema,
  AdvertisementFormData,
} from "@/app/lib/validations/advertisementSchema";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface CreateAdvertisementFormProps {
  sponsors: Pick<Sponsor, "id" | "name">[];
  articles: Pick<Article, "id" | "title">[];
  categories: Pick<Category, "id" | "name">[];
  onSubmit: (data: AdvertisementFormData) => Promise<void>;
  defaultValues?: Partial<AdvertisementFormData>;
}

export default function CreateAdvertisementForm({
  sponsors,
  articles,
  categories,
  onSubmit,
  defaultValues,
}: CreateAdvertisementFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!defaultValues;
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewVideo, setPreviewVideo] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  // Format dates for HTML date inputs (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Prepare formatted default values
  const formattedDefaultValues = defaultValues
    ? {
        ...defaultValues,
        start_date: formatDateForInput(defaultValues.start_date),
        end_date: formatDateForInput(defaultValues.end_date),
      }
    : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AdvertisementFormData>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: formattedDefaultValues,
  });

  const handleFormSubmit = async (data: AdvertisementFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(data);
      router.push("/dashboard/advertisements");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/advertisements");
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image file size should be less than 5MB");
      return;
    }

    setSelectedImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setValue("image_url", imageUrl);
  };

  const handleVideoFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("Video file size should be less than 50MB");
      return;
    }

    setSelectedVideoFile(file);
    const videoUrl = URL.createObjectURL(file);
    setPreviewVideo(videoUrl);
    setValue("video_url", videoUrl);
  };

  const handleImageUrlChange = async (url: string) => {
    if (!url) {
      setPreviewImage("");
      setSelectedImageFile(null);
      return;
    }

    setIsImageLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError("Failed to load image. Please check the URL.");
        setPreviewImage("");
      } else {
        setPreviewImage(url);
        setValue("image_url", url);
      }
    } catch (error) {
      setError("Invalid image URL");
      setPreviewImage("");
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleVideoUrlChange = async (url: string) => {
    if (!url) {
      setPreviewVideo("");
      setSelectedVideoFile(null);
      return;
    }

    setIsVideoLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError("Failed to load video. Please check the URL.");
        setPreviewVideo("");
      } else {
        setPreviewVideo(url);
        setValue("video_url", url);
      }
    } catch (error) {
      setError("Invalid video URL");
      setPreviewVideo("");
    } finally {
      setIsVideoLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Edit Advertisement" : "Create New Advertisement"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="sponsor_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sponsor
            </label>
            <select
              id="sponsor_id"
              {...register("sponsor_id", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a sponsor</option>
              {sponsors.map((sponsor) => (
                <option key={sponsor.id} value={sponsor.id}>
                  {sponsor.name}
                </option>
              ))}
            </select>
            {errors.sponsor_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.sponsor_id.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="article_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Article
            </label>
            <select
              id="article_id"
              {...register("article_id", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category_id"
              {...register("category_id", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ad_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Advertisement Type
            </label>
            <select
              id="ad_type"
              {...register("ad_type")}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select type</option>
              <option value="banner">Banner</option>
              <option value="video">Video</option>
            </select>
            {errors.ad_type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ad_type.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              {...register("start_date")}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.start_date.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              {...register("end_date")}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.end_date.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="ad_content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Advertisement Content
            </label>
            <textarea
              id="ad_content"
              rows={4}
              {...register("ad_content")}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.ad_content && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ad_content.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="relative w-full">
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image{" "}
                {!watch("video_url") && <span className="text-red-500">*</span>}
              </label>
              <div className="mt-1 flex items-center space-x-4 w-full">
                <input
                  type="url"
                  id="image_url"
                  {...register("image_url")}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 ${
                    errors.image_url ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter image URL or upload a file"
                />
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image_url && (
                <div className="mt-1 flex items-center text-sm text-red-500">
                  <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                  {errors.image_url.message}
                </div>
              )}
              {isImageLoading && (
                <div className="mt-2 text-sm text-gray-500">
                  Loading preview...
                </div>
              )}
              {previewImage && (
                <div className="mt-2 rounded-md border border-gray-300 p-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-40 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="relative w-full">
              <label
                htmlFor="video_url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Video{" "}
                {!watch("image_url") && <span className="text-red-500">*</span>}
              </label>
              <div className="mt-1 flex items-center space-x-4 w-full">
                <input
                  type="url"
                  id="video_url"
                  {...register("video_url")}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 ${
                    errors.video_url ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter video URL or upload a file"
                />
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                  Upload
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.video_url && (
                <div className="mt-1 flex items-center text-sm text-red-500">
                  <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                  {errors.video_url.message}
                </div>
              )}
              {isVideoLoading && (
                <div className="mt-2 text-sm text-gray-500">
                  Validating video URL...
                </div>
              )}
              {previewVideo && (
                <div className="mt-2 rounded-md border border-gray-300 p-2">
                  {previewVideo.includes("youtube") ? (
                    <iframe
                      width="100%"
                      height="200"
                      src={previewVideo.replace("watch?v=", "embed/")}
                      title="Video preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      controls
                      className="max-h-40 w-full"
                      src={previewVideo}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Advertisement"
              : "Create Advertisement"}
          </button>
        </div>
      </form>
    </div>
  );
}
