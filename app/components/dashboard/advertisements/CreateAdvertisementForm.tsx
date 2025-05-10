"use client";

import { useState, useEffect } from "react";
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
import {
  ExclamationCircleIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryUtils";
import { toast } from "react-hot-toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";

interface CreateAdvertisementFormProps {
  sponsors: Pick<Sponsor, "id" | "name">[];
  articles: Pick<Article, "id" | "title">[];
  categories: Pick<Category, "id" | "name">[];
  onSubmit: (data: {
    sponsor_id: number;
    article_id?: number;
    category_id?: number;
    ad_type: "banner" | "video";
    ad_content: string;
    start_date: string;
    end_date: string;
    image_url: string | null;
    video_url: string | null;
  }) => Promise<{ success: boolean; error?: string }>;
  onImageFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onVideoFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading?: boolean;
  imageUrl?: string | null;
  videoUrl?: string | null;
  defaultValues?: Partial<AdvertisementFormData>;
  isEditMode?: boolean;
}

export default function CreateAdvertisementForm({
  sponsors,
  articles,
  categories,
  onSubmit,
  onImageFileChange,
  onVideoFileChange,
  isUploading = false,
  imageUrl = null,
  videoUrl = null,
  defaultValues,
  isEditMode = false,
}: CreateAdvertisementFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(
    imageUrl || defaultValues?.image_url || ""
  );
  const [previewVideo, setPreviewVideo] = useState<string>(
    videoUrl || defaultValues?.video_url || ""
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  // Update preview states when props change
  useEffect(() => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
    }
    if (videoUrl) {
      setPreviewVideo(videoUrl);
    }
  }, [imageUrl, videoUrl]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdvertisementFormData>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: defaultValues || {
      sponsor_id: 0,
      article_id: 0,
      category_id: 0,
      ad_type: "banner",
      ad_content: "",
      start_date: "",
      end_date: "",
      image_url: "",
      video_url: "",
    },
  });

  const adType = watch("ad_type");

  const handleFormSubmit = async (data: AdvertisementFormData) => {
    try {
      setIsSubmitting(true);
      const result = await onSubmit({
        ...data,
        article_id: data.article_id || undefined,
        category_id: data.category_id || undefined,
        image_url: data.image_url || null,
        video_url: data.video_url || null,
      });

      if (result.success) {
        toast.success(
          isEditMode
            ? "Advertisement updated successfully!"
            : "Advertisement created successfully!"
        );
        router.push("/dashboard/advertisements");
      } else {
        toast.error(
          result.error ||
            (isEditMode
              ? "Failed to update advertisement"
              : "Failed to create advertisement")
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/advertisements");
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImageLoading(true);
      console.log("Starting image upload with file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const result = await uploadToCloudinary(file, "image");
      console.log("Image upload result:", result);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload image");
      }

      setValue("image_url", result.url || "");
      setPreviewImage(result.url || "");
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleVideoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsVideoLoading(true);
      console.log("Starting video upload with file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const result = await uploadToCloudinary(file, "video");
      console.log("Video upload result:", result);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload video");
      }

      setValue("video_url", result.url || "");
      setPreviewVideo(result.url || "");
      toast.success("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setIsVideoLoading(false);
    }
  };

  // Clean up object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      if (previewVideo && previewVideo.startsWith("blob:")) {
        URL.revokeObjectURL(previewVideo);
      }
    };
  }, [previewImage, previewVideo]);

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
              Sponsor <span className="text-red-500">*</span>
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
              Article (Optional)
            </label>
            <select
              id="article_id"
              {...register("article_id", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select an article (optional)</option>
              {articles.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category (Optional)
            </label>
            <select
              id="category_id"
              {...register("category_id", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="ad_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Advertisement Type <span className="text-red-500">*</span>
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
              Start Date <span className="text-red-500">*</span>
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
              End Date <span className="text-red-500">*</span>
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
              Advertisement Content <span className="text-red-500">*</span>
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
            {adType === "banner" && (
              <div className="relative w-full">
                <label
                  htmlFor="image_file"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="image_file"
                    name="image_file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    disabled={isImageLoading}
                  />
                </div>
                {errors.image_url && (
                  <div className="mt-1 flex items-center text-sm text-red-500">
                    <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                    {errors.image_url.message}
                  </div>
                )}
                {isImageLoading && <LoadingSpinner />}
                {previewImage && !isImageLoading && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Preview:
                    </p>
                    <div className="mt-1 relative h-48 w-48 overflow-hidden rounded-md">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {adType === "video" && (
              <div className="relative w-full">
                <label
                  htmlFor="video_file"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Video <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="video_file"
                    name="video_file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    disabled={isVideoLoading}
                  />
                </div>
                {errors.video_url && (
                  <div className="mt-1 flex items-center text-sm text-red-500">
                    <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                    {errors.video_url.message}
                  </div>
                )}
                {isVideoLoading && <LoadingSpinner />}
                {previewVideo && !isVideoLoading && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Preview:
                    </p>
                    <div className="mt-1 relative h-48 w-48 overflow-hidden rounded-md">
                      {previewVideo.includes("youtube") ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={previewVideo.replace("watch?v=", "embed/")}
                          title="Video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          controls
                          className="h-full w-full object-cover"
                          src={previewVideo}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-zinc-200 hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="inline-flex items-center gap-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-zinc-200 hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
