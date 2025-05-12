"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  authorSchema,
  type AuthorFormData,
} from "../../../lib/validations/authorSchema";
import { createAuthor, updateAuthor } from "../../../lib/actions/authors";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Author } from "../../../lib/definition";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface AuthorFormProps {
  author?: Author;
}

export default function AuthorForm({ author }: AuthorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isEditMode = !!author;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema) as any,
    defaultValues: {
      name: author?.name || "",
      description: author?.description || "",
      bio: author?.bio || "",
    },
  });

  // Update form values when author prop changes
  useEffect(() => {
    if (author) {
      reset({
        name: author.name,
        description: author.description || "",
        bio: author.bio || "",
      });
    }
  }, [author, reset]);

  const onSubmit = async (data: AuthorFormData) => {
    try {
      setIsSubmitting(true);

      if (isEditMode && author) {
        const { success, error } = await updateAuthor(author.id, data);

        if (error) {
          toast.error(error);
          return;
        }

        if (success) {
          toast.success("Author updated successfully");
          router.refresh();
          router.push("/dashboard/author");
        }
      } else {
        const { success, error } = await createAuthor(data);

        if (error) {
          toast.error(error);
          return;
        }

        if (success) {
          toast.success("Author created successfully");
          reset();
          router.refresh();
          router.push("/dashboard/author");
        }
      }
    } catch (error) {
      toast.error(
        isEditMode ? "Failed to update author" : "Failed to create author"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Edit Author" : "Create New Author"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit) as any} className="p-6 space-y-6">
        {/* Required Fields Note */}
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
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
            <input
              type="text"
              id="description"
              {...register("description")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio <span className="text-sm text-gray-400">(optional)</span>
            </label>
            <textarea
              id="bio"
              rows={3}
              {...register("bio")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/author")}
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
