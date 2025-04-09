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
import { Author } from "../../../type/definitions";

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
    <form onSubmit={handleSubmit(onSubmit) as any}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          <input
            type="text"
            id="description"
            {...register("description")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            {...register("bio")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Author"
            : "Create Author"}
        </button>
      </div>
    </form>
  );
}
