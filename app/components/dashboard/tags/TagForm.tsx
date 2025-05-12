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
import { Tag } from "../../../lib/definition";
import toast from "react-hot-toast";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

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
          router.refresh();
          router.push("/dashboard/tags");
        }
      } else {
        const { error } = await createTag(formData);
        if (error) {
          setError(error);
          toast.error(error);
        } else {
          toast.success("Tag created successfully");
          router.refresh();
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {tag ? "Edit Tag" : "Create New Tag"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Required Fields Note */}
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
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
              Description{" "}
              <span className="text-sm text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
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
              Color <span className="text-sm text-gray-400">(optional)</span>
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
                placeholder="#000000"
              />
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">
                {errors.color.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/tags")}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              "Processing..."
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
