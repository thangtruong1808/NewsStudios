"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createArticle, updateArticle } from "../../../lib/actions/articles";
import { uploadToFTP } from "../../../lib/utils/ftp";
import {
  User,
  Category as CategoryType,
  Author as AuthorType,
  SubCategory,
  Tag,
} from "../../../lib/definition";

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
  is_featured: z.boolean().default(false),
  headline_priority: z.coerce.number().default(0),
  headline_image_url: z.string().optional(),
  headline_video_url: z.string().optional(),
  is_trending: z.boolean().default(false),
  tag_ids: z.array(z.number()).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  article?: {
    id: number;
    title: string;
    content: string;
    category_id: number;
    author_id: number;
    user_id: number;
    sub_category_id?: number;
    image?: string | null;
    video?: string | null;
    is_featured: boolean;
    headline_priority: number;
    headline_image_url?: string | null;
    headline_video_url?: string | null;
    is_trending: boolean;
    tag_ids: number[];
    created_at: Date;
    updated_at: Date;
    published_at: Date;
  };
  categories: Category[];
  authors: Author[];
  subcategories: Subcategory[];
  users: User[];
  tags: Tag[];
}

export default function ArticleForm({
  article,
  categories = [],
  authors = [],
  subcategories = [],
  users = [],
  tags = [],
}: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    article?.category_id.toString() || ""
  );
  const [selectedTags, setSelectedTags] = useState<number[]>(
    Array.isArray(article?.tag_ids) ? article.tag_ids : []
  );

  // Add state for file URLs
  const [imageUrl, setImageUrl] = useState<string | null>(
    article?.image || null
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(
    article?.video || null
  );
  const [headlineImageUrl, setHeadlineImageUrl] = useState<string | null>(
    article?.headline_image_url || null
  );
  const [headlineVideoUrl, setHeadlineVideoUrl] = useState<string | null>(
    article?.headline_video_url || null
  );

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
    setValue,
    watch,
    setError,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      category_id: article?.category_id || undefined,
      author_id: article?.author_id || undefined,
      user_id: article?.user_id || undefined,
      sub_category_id: article?.sub_category_id || undefined,
      image: article?.image || "",
      video: article?.video || "",
      is_featured: article?.is_featured || false,
      headline_priority: article?.headline_priority || 0,
      headline_image_url: article?.headline_image_url || "",
      headline_video_url: article?.headline_video_url || "",
      is_trending: article?.is_trending || false,
      tag_ids: article?.tag_ids || [],
    },
  });

  // Initialize form with article data if editing
  useEffect(() => {
    if (article) {
      // Set form values
      setValue("title", article.title);
      setValue("content", article.content);
      setValue("category_id", article.category_id);
      setValue("author_id", article.author_id);
      setValue("user_id", article.user_id);
      setValue("sub_category_id", article.sub_category_id || undefined);
      setValue("image", article.image || "");
      setValue("video", article.video || "");
      setValue("is_featured", article.is_featured);
      setValue("headline_priority", article.headline_priority);
      setValue("headline_image_url", article.headline_image_url || "");
      setValue("headline_video_url", article.headline_video_url || "");
      setValue("is_trending", article.is_trending);

      // Set selected category for subcategory filtering
      setSelectedCategory(article.category_id.toString());

      // Set image and video URLs
      setImageUrl(article.image || null);
      setVideoUrl(article.video || null);
      setHeadlineImageUrl(article.headline_image_url || null);
      setHeadlineVideoUrl(article.headline_video_url || null);

      // Set selected tags
      if (article.tag_ids && article.tag_ids.length > 0) {
        setSelectedTags(article.tag_ids);
        setValue("tag_ids", article.tag_ids);
      }
    }
  }, [article, setValue]);

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === parseInt(selectedCategory)
  );

  // Handle tag selection
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    setSelectedTags(selectedOptions);
    setValue("tag_ids", selectedOptions);
  };

  const handleFileUpload = async (
    file: File,
    type: "image" | "video" | "headlineImage" | "headlineVideo"
  ) => {
    try {
      setUploadProgress((prev) => ({
        ...prev,
        [type]: 0,
      }));

      const { url, error } = await uploadToFTP(file);

      if (error) {
        toast.error(`Failed to upload ${type}: ${error}`);
        return;
      }

      setUploadProgress((prev) => ({
        ...prev,
        [type]: 100,
      }));

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
      setUploadProgress((prev) => ({
        ...prev,
        [type]: undefined,
      }));
    }
  };

  const handleTagSelect = (tagId: number) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleTagRemove = (tagId: number) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare article data
      const articleData = {
        ...data,
        image: imageUrl,
        video: videoUrl,
        headline_image_url: headlineImageUrl,
        headline_video_url: headlineVideoUrl,
        tag_ids: selectedTags,
        id: article?.id || 0,
        created_at: article?.created_at || new Date(),
        updated_at: new Date(),
        published_at: article?.published_at || new Date(),
      };

      // Create or update article
      if (article?.id) {
        // Update existing article
        await updateArticle(article.id, articleData, selectedTags);
        toast.success("Article updated successfully");
      } else {
        // Create new article
        await createArticle(articleData, selectedTags);
        toast.success("Article created successfully");
      }

      // Redirect to articles page
      router.push("/dashboard/articles");
      router.refresh();
    } catch (error) {
      console.error("Error submitting article:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit article"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    // Construct the full URL from the filename
    const imageUrl = `/Images/${imagePath}`;
    const fullUrl = `https://srv876-files.hstgr.io/83e36b91bb471f62/files/public_html${imageUrl}`;

    // Return the direct URL
    return fullUrl;
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
                style={{
                  width: `${uploadProgress.image}%`,
                }}
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
                style={{
                  width: `${uploadProgress.video}%`,
                }}
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
          {...register("headline_priority", {
            valueAsNumber: true,
          })}
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

      <div className="space-y-2">
        <label
          htmlFor="tag_ids"
          className="block text-sm font-medium text-gray-700"
        >
          Tags
        </label>
        <select
          id="tag_ids"
          multiple
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4"
          onChange={handleTagChange}
          value={Array.isArray(selectedTags) ? selectedTags.map(String) : []}
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id} className="py-2">
              {tag.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">
          Hold Ctrl (Windows) or Command (Mac) to select multiple tags
        </p>
        {errors.tag_ids && (
          <p className="text-sm text-red-600">{errors.tag_ids.message}</p>
        )}
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
          {isSubmitting
            ? article?.id
              ? "Updating..."
              : "Creating..."
            : article?.id
            ? "Update Article"
            : "Create Article"}
        </button>
      </div>
    </form>
  );
}
