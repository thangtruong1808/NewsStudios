"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface PhotoFormProps {
  initialData?: {
    id?: number;
    title: string;
    description: string;
    image_url: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
}

/**
 * PhotoForm Component
 *
 * A form component for creating and editing photos that:
 * - Handles image upload and preview
 * - Manages form state and validation
 * - Provides feedback via toast notifications
 * - Maintains consistent styling with other form components
 */
export default function PhotoForm({
  initialData,
  onSubmit,
  isEditing = false,
}: PhotoFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.image_url || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      toast.success(
        isEditing ? "Photo updated successfully" : "Photo created successfully"
      );
      router.push("/dashboard/photos");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save photo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={initialData?.title}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          defaultValue={initialData?.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image
        </label>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required={!isEditing}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {previewUrl && (
        <div className="mt-2">
          <div className="relative w-40 h-40">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Photo"
            : "Create Photo"}
        </button>
      </div>
    </form>
  );
}
