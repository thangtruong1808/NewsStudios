"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  tagSchema,
  type TagFormData,
} from "../../../lib/validations/tagSchema";
import { createTag, updateTag } from "../../../lib/actions/tags";
import { Tag } from "../../../login/login-definitions";
import toast from "react-hot-toast";

interface TagFormProps {
  tag?: Tag;
}

export default function TagForm({ tag }: TagFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      description: tag?.description || "",
      color: tag?.color || "#3B82F6", // Default blue color
    },
  });

  // Watch the color value from the form
  const colorValue = watch("color") || "#3B82F6";

  // Handle color change from either input
  const handleColorChange = (newColor: string) => {
    setValue("color", newColor.toUpperCase());
  };

  const onSubmit = async (data: TagFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Ensure color is in uppercase format
      const formData = {
        ...data,
        color: (data.color || "#3B82F6").toUpperCase(),
      };

      if (tag) {
        const { error } = await updateTag(tag.id, formData);
        if (error) {
          setError(error);
          toast.error(error);
        } else {
          toast.success("Tag updated successfully");
          router.push("/dashboard/tags");
        }
      } else {
        const { error } = await createTag(formData);
        if (error) {
          setError(error);
          toast.error(error);
        } else {
          toast.success("Tag created successfully");
          router.push("/dashboard/tags");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tag Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={colorValue}
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                handleColorChange(input.value);
              }}
              className="h-10 w-10 rounded border border-gray-300 p-1"
            />
            <input
              type="text"
              {...register("color")}
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                handleColorChange(input.value);
              }}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="#000000"
            />
          </div>
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/tags")}
            className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : tag ? "Update Tag" : "Create Tag"}
          </button>
        </div>
      </form>
    </div>
  );
}
