"use client";

import { Article, Image } from "@/app/lib/definition";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NextImage from "next/image";

const photoSchema = z.object({
  description: z.string().min(1, "Description is required"),
  articleId: z.string().optional(),
});

type PhotoFormData = z.infer<typeof photoSchema>;

/**
 * Props interface for PhotoForm component
 */
/* eslint-disable no-unused-vars */
interface PhotoFormProps {
  articles: Article[];
  image?: Image;
  isSubmitting: boolean;
  uploadProgress: number;
  isImageProcessing: boolean;
  previewUrl: string | null;
  formValues: {
    file: File | null;
    description: string;
    articleId: string;
  };
  isFormEmpty: boolean;
  isImageAvailable: boolean;
  onInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  onSubmit: (event: React.FormEvent) => void;
}
/* eslint-enable no-unused-vars */

// Description: Render dashboard photo create/edit form with upload preview and article linking.
// Data created: 2024-11-13
// Author: thangtruong
export default function PhotoForm({
  articles,
  image,
  isSubmitting,
  uploadProgress,
  isImageProcessing,
  previewUrl,
  formValues,
  isFormEmpty,
  isImageAvailable,
  onInputChange,
  onFileChange,
  onClearFile,
  onSubmit,
}: PhotoFormProps) {
  const router = useRouter();
  const isEditMode = !!image;

  const {
    register,
    formState: { errors },
  } = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      description: formValues.description,
      articleId: formValues.articleId,
    },
  });

  const handleCancel = () => {
    router.push("/dashboard/photos");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Image Upload Section */}
      <div className="col-span-full">
        <label
          htmlFor="file"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Photo <span className="text-xs">(*)</span>
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            {isImageProcessing ? (
              <div className="flex flex-col items-center">
                <ArrowPathIcon className="h-12 w-12 animate-spin text-gray-400" />
                <div className="mt-2 text-sm text-gray-500">
                  Processing image... {uploadProgress}%
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative">
                <NextImage
                  src={previewUrl}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="mx-auto h-32 w-32 object-cover"
                />
                <button
                  type="button"
                  onClick={onClearFile}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : isImageAvailable ? (
              <div className="relative">
                {image && (
                  <NextImage
                    src={image.image_url}
                    alt="Current"
                    width={128}
                    height={128}
                    className="mx-auto h-32 w-32 object-cover"
                  />
                )}
              </div>
            ) : (
              <PhotoIcon
                className="mx-auto h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
            )}
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onFileChange}
                  disabled={isImageProcessing}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Description and Article Association */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description <span className="text-xs">(*)</span>
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              rows={5}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
              {...register("description")}
              onChange={onInputChange}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="articleId"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Associated Article <span className="text-xs">(optional)</span>
          </label>
          <div className="mt-2">
            <select
              id="articleId"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
              {...register("articleId")}
              onChange={onInputChange}
            >
              <option value="">Select an article (optional)</option>
              {articles && articles.length > 0 ? (
                articles.map((article) => (
                  <option key={article.id} value={article.id}>
                    [{article.id}] {article.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No articles available
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isImageProcessing || isFormEmpty}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Photo"
              : "Create Photo"}
        </button>
      </div>
    </form>
  );
}
