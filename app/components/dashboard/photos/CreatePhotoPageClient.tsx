"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Article, Image } from "@/app/lib/definition";
import { toast } from "react-hot-toast";
import { uploadImageToServer, updateImage } from "@/app/lib/actions/images";

/**
 * Props interface for CreatePhotoPageClient component
 * @property articles - List of available articles for photo association
 * @property image - Optional image data for edit mode
 */
interface CreatePhotoPageClientProps {
  articles: Article[];
  image?: Image; // Make image optional for create mode
}

/**
 * CreatePhotoPageClient Component
 * A form component for creating and editing photos with features for:
 * - File upload handling with validation
 * - Article association
 * - Description management
 * - Form state tracking
 * - Error handling with toast notifications
 * - Responsive layout with gradient styling
 */
export default function CreatePhotoPageClient({
  articles,
  image,
}: CreatePhotoPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    file: "",
    description: image?.description || "",
  });

  // Determine if component is in edit mode
  const isEditMode = !!image;

  // Check if form is empty (required for create mode)
  const isFormEmpty = !formValues.file;

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Handles success/error notifications and navigation
   */
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && image) {
        const result = await updateImage(image.id, {
          description: formData.get("description") as string,
          type: "gallery",
          entity_type: "article",
          entity_id: formData.get("article_id")
            ? parseInt(formData.get("article_id") as string)
            : 0,
          is_featured: false,
          display_order: 0,
        });

        if (!result.success) {
          throw new Error("Failed to update photo");
        }

        toast.success("Photo updated successfully");
      } else {
        const result = await uploadImageToServer(formData);
        if (result.error) {
          throw new Error(result.error);
        }

        toast.success("Photo created successfully");
      }

      router.push("/dashboard/photos");
      router.refresh();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} photo:`,
        error
      );
      toast.error(
        isEditMode ? "Failed to update photo" : "Failed to create photo"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Input change handler
   * Updates form state when input values change
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Form header with gradient background */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
            <h2 className="text-xl font-semibold text-white">
              {isEditMode ? "Edit Photo" : "Create New Photo"}
            </h2>
          </div>

          {/* Main form content */}
          <form action={handleSubmit} className="p-6 space-y-6">
            <p className="text-xs text-gray-500">
              Fields marked with an asterisk (*) are required
            </p>

            <div className="space-y-6">
              {/* File upload field */}
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo {!isEditMode && "*"}
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    required={!isEditMode}
                    onChange={handleInputChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
              </div>

              {/* Article selection field */}
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
                    defaultValue={image?.article_id || ""}
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

              {/* Description field */}
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
                    rows={8}
                    onChange={handleInputChange}
                    defaultValue={image?.description || ""}
                    placeholder="Enter photo description"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Form action buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!isEditMode && isFormEmpty)}
                className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Photo"
                  : "Create Photo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
