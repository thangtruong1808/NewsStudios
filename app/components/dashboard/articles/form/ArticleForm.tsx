"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createArticle, updateArticle } from "../../../../lib/actions/articles";
import { uploadToCloudinary } from "../../../../lib/utils/cloudinaryUtils";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  User,
  Category as CategoryType,
  Author as AuthorType,
  SubCategory,
  Tag,
  Article,
} from "../../../../lib/definition";
import { articleSchema, ArticleFormData } from "./articleSchema";
import {
  BasicFields,
  ContentFields,
  MediaFields,
  SettingsFields,
  TagFields,
} from "./fields";

interface ArticleFormProps {
  article?: Partial<Article>;
  categories: CategoryType[];
  authors: AuthorType[];
  subcategories: SubCategory[];
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
    article?.category_id?.toString() || ""
  );
  const [selectedTags, setSelectedTags] = useState<number[]>(
    Array.isArray(article?.tag_ids) ? article.tag_ids : []
  );
  const [activeTab, setActiveTab] = useState("basic");
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);
  const [imageUrl, setImageUrl] = useState<string | null>(
    article?.image || null
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(
    article?.video || null
  );
  const [uploadProgress, setUploadProgress] = useState<{
    image?: number;
    video?: number;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
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
      is_trending: article?.is_trending || false,
      tag_ids: article?.tag_ids || [],
    },
  });

  useEffect(() => {
    if (article) {
      setValue("title", article.title || "");
      setValue("content", article.content || "");
      if (article.category_id) setValue("category_id", article.category_id);
      if (article.author_id) setValue("author_id", article.author_id);
      if (article.user_id) setValue("user_id", article.user_id);
      if (article.sub_category_id)
        setValue("sub_category_id", article.sub_category_id);
      setValue("image", article.image || "");
      setValue("video", article.video || "");
      setValue("is_featured", article.is_featured || false);
      setValue("headline_priority", article.headline_priority || 0);
      setValue("is_trending", article.is_trending || false);
      setSelectedCategory(article.category_id?.toString() || "");
      setImageUrl(article.image || null);
      setVideoUrl(article.video || null);
      if (article.tag_ids && article.tag_ids.length > 0) {
        setSelectedTags(article.tag_ids);
        setValue("tag_ids", article.tag_ids);
      }
    }
  }, [article, setValue]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id === parseInt(selectedCategory)
      );
      setFilteredSubcategories(filtered);
      const currentSubcategoryId = watch("sub_category_id");
      if (
        currentSubcategoryId &&
        !filtered.some((sub) => sub.id === currentSubcategoryId)
      ) {
        setValue("sub_category_id", undefined);
      }
    } else {
      setFilteredSubcategories([]);
      setValue("sub_category_id", undefined);
    }
  }, [selectedCategory, subcategories, setValue, watch]);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    setSelectedTags(selectedOptions);
    setValue("tag_ids", selectedOptions, {
      shouldValidate: true,
    });
  };

  const handleFileUpload = async (file: File, type: "image" | "video") => {
    try {
      setUploadProgress((prev) => ({
        ...prev,
        [type]: 0,
      }));

      if (type === "image" && !file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (type === "video" && !file.type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }

      if (type === "image" && file.size > 100 * 1024 * 1024) {
        toast.error("Image file size must be less than 100MB");
        return;
      }
      if (type === "video" && file.size > 500 * 1024 * 1024) {
        toast.error("Video file size must be less than 500MB");
        return;
      }

      const result = await uploadToCloudinary(
        file,
        type === "video" ? "video" : "image"
      );

      if (!result.success || !result.url) {
        toast.error(`Failed to upload ${type}: ${result.error}`);
        return;
      }

      setUploadProgress((prev) => ({
        ...prev,
        [type]: 100,
      }));

      if (type === "image") {
        setImageUrl(result.url);
        setValue("image", result.url);
      } else {
        setVideoUrl(result.url);
        setValue("video", result.url);
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setValue("category_id", categoryId ? parseInt(categoryId) : 0, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const articleData: Article = {
        id: article?.id || 0,
        title: data.title,
        content: data.content,
        category_id: data.category_id,
        author_id: data.author_id,
        user_id: data.user_id,
        sub_category_id: data.sub_category_id,
        image: imageUrl || undefined,
        video: videoUrl || undefined,
        is_featured: data.is_featured,
        headline_priority: data.headline_priority,
        is_trending: data.is_trending,
        created_at: now,
        updated_at: now,
        published_at: now,
        comments: [],
        views: 0,
        likes: 0,
        tag_ids: selectedTags,
      };

      if (article?.id) {
        await updateArticle(article.id, articleData, selectedTags);
        toast.success("Article updated successfully");
      } else {
        await createArticle(articleData, selectedTags);
        toast.success("Article created successfully");
      }

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {article ? "Edit Article" : "Create New Article"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`${
                activeTab === "basic"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`${
                activeTab === "content"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`${
                activeTab === "media"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Media
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`${
                activeTab === "settings"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {activeTab === "basic" && (
            <>
              <BasicFields
                register={register}
                errors={errors}
                control={control}
                categories={categories}
                authors={authors}
                users={users}
                subcategories={subcategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                filteredSubcategories={filteredSubcategories}
              />
              <TagFields
                register={register}
                errors={errors}
                tags={tags}
                selectedTags={selectedTags}
                onTagChange={handleTagChange}
              />
            </>
          )}

          {activeTab === "content" && (
            <ContentFields register={register} errors={errors} />
          )}

          {activeTab === "media" && (
            <MediaFields
              register={register}
              errors={errors}
              imageUrl={imageUrl}
              videoUrl={videoUrl}
              uploadProgress={uploadProgress}
              onFileUpload={handleFileUpload}
            />
          )}

          {activeTab === "settings" && (
            <SettingsFields register={register} errors={errors} />
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/articles")}
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
