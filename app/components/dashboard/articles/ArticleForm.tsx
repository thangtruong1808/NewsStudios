"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createArticle, Article } from "../../../lib/actions/articles";
import { uploadToFTP } from "../../../lib/utils/ftp";
import { User, Category, Author, SubCategory } from "../../../lib/definition";

// Define types for the form
interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Author {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  description?: string;
}

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category_id: z.coerce.number().min(1, "Category is required"),
  author_id: z.coerce.number().min(1, "Author is required"),
  user_id: z.coerce.number().min(1, "User is required"),
  sub_category_id: z.coerce.number().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  is_featured: z.boolean().optional(),
  headline_priority: z.coerce.number().optional(),
  headline_image_url: z.string().optional(),
  headline_video_url: z.string().optional(),
  is_trending: z.boolean().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  categories: Category[];
  authors: Author[];
  subcategories: Subcategory[];
  users: User[];
}

export default function ArticleForm({
  categories = [],
  authors = [],
  subcategories = [],
  users = [],
}: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Add state for file URLs
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [headlineImageUrl, setHeadlineImageUrl] = useState<string | null>(null);
  const [headlineVideoUrl, setHeadlineVideoUrl] = useState<string | null>(null);

  // Add state for upload progress
  const [uploadProgress, setUploadProgress] = useState<{
    image?: number;
    video?: number;
    headlineImage?: number;
    headlineVideo?: number;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      is_featured: false,
      is_trending: false,
    },
  });

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === parseInt(selectedCategory)
  );

  const handleFileUpload = async (
    file: File,
    type: "image" | "video" | "headlineImage" | "headlineVideo"
  ) => {
    try {
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));

      const { url, error } = await uploadToFTP(file);

      if (error) {
        toast.error(`Failed to upload ${type}: ${error}`);
        return;
      }

      setUploadProgress((prev) => ({ ...prev, [type]: 100 }));

      switch (type) {
        case "image":
          setImageUrl(url);
          break;
        case "video":
          setVideoUrl(url);
          break;
        case "headlineImage":
          setHeadlineImageUrl(url);
          break;
        case "headlineVideo":
          setHeadlineVideoUrl(url);
          break;
      }

      toast.success(`${type} uploaded successfully`);
    } catch (error) {
      toast.error(`Error uploading ${type}`);
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setUploadProgress((prev) => ({ ...prev, [type]: undefined }));
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    try {
      setIsSubmitting(true);
      const result = await createArticle({
        ...data,
        image: imageUrl ?? data.image ?? undefined,
        video: videoUrl ?? data.video ?? undefined,
        headline_image_url:
          headlineImageUrl ?? data.headline_image_url ?? undefined,
        headline_video_url:
          headlineVideoUrl ?? data.headline_video_url ?? undefined,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Article created successfully");
        router.push("/dashboard/articles");
      }
    } catch (error) {
      toast.error("Failed to create article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register("title")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          {...register("content")}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          {...register("category_id")}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
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
        <label className="block text-sm font-medium text-gray-700">
          Subcategory
        </label>
        <select
          {...register("sub_category_id")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
          disabled={!selectedCategory}
        >
          <option value="">Select a subcategory</option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Author
        </label>
        <select
          {...register("author_id")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
        >
          <option value="">Select an author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        {errors.author_id && (
          <p className="mt-1 text-sm text-red-600">
            {errors.author_id.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">User</label>
        <select
          {...register("user_id")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
        {errors.user_id && (
          <p className="mt-1 text-sm text-red-600">{errors.user_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="text"
            {...register("image")}
            placeholder="Image URL"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file, "image");
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {uploadProgress.image !== undefined && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${uploadProgress.image}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Video</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="text"
            {...register("video")}
            placeholder="Video URL"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file, "video");
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {uploadProgress.video !== undefined && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${uploadProgress.video}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("is_featured")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Featured Article
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("is_trending")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Trending Article
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Headline Priority
        </label>
        <input
          type="number"
          {...register("headline_priority", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Headline Image URL
        </label>
        <input
          type="text"
          {...register("headline_image_url")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Headline Video URL
        </label>
        <input
          type="text"
          {...register("headline_video_url")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Article"}
        </button>
      </div>
    </form>
  );
}
