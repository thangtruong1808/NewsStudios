"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import {
  createArticle,
  updateArticle,
} from "../../../../../lib/actions/articles";
import { uploadToCloudinary } from "../../../../../lib/utils/cloudinaryUtils";
import { Article, SubCategory, Tag } from "../../../../../lib/definition";
import { articleSchema, ArticleFormData } from "../articleSchema";
import { getTagsBySubcategory } from "@/app/lib/actions/tags";

interface UseArticleFormProps {
  article?: Partial<Article>;
  subcategories: SubCategory[];
  tags: Tag[];
  userId?: number;
}

// Component Info
// Description: Manage article form state, media uploads, and submission handling.
// Date updated: 2025-November-21
// Author: thangtruong
export function useArticleForm({
  article,
  subcategories,
  tags: initialTags,
  userId,
}: UseArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<
    "basic" | "content" | "media" | "settings"
  >("basic");
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  // Initialize react-hook-form with validation schema
  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      category_id: article?.category_id || undefined,
      author_id: article?.author_id || undefined,
      user_id: userId || article?.user_id || undefined,
      sub_category_id: article?.sub_category_id || undefined,
      image: article?.image || "",
      video: article?.video || "",
      is_featured: article?.is_featured || false,
      headline_priority: article?.headline_priority || 0,
      is_trending: article?.is_trending || false,
      tag_ids: article?.tag_ids || [],
    },
    mode: "onChange",
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState,
  } = form;
  const subcategoryId = watch("sub_category_id");
  const titleValue = watch("title") ?? "";
  const contentValue = watch("content") ?? "";

  // Initialize form with article data
  useEffect(() => {
    if (!article) {
      setSelectedCategory("");
      setSelectedTags([]);
      setImageUrl("");
      setVideoUrl("");
      return;
    }

    reset({
      title: article.title || "",
      content: article.content || "",
      category_id: article.category_id || undefined,
      author_id: article.author_id || undefined,
      user_id: userId || article.user_id || undefined,
      sub_category_id: article.sub_category_id || undefined,
      image: article.image || "",
      video: article.video || "",
      is_featured: article.is_featured || false,
      headline_priority: article.headline_priority || 0,
      is_trending: article.is_trending || false,
      tag_ids: article.tag_ids || [],
    });

    if (article.category_id) {
      setSelectedCategory(article.category_id.toString());
      setFilteredSubcategories(
        subcategories.filter(
          (sub) => sub.category_id === Number(article.category_id)
        )
      );
    }

    if (article.tag_ids) {
      setSelectedTags(article.tag_ids);
    }

    setImageUrl(article.image || "");
    setVideoUrl(article.video || "");
  }, [article, reset, subcategories, userId]);

  // Single useEffect to handle subcategory filtering
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id === parseInt(selectedCategory)
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  // Add effect to fetch tags when subcategory changes
  useEffect(() => {
    const fetchTags = async () => {
      if (subcategoryId) {
        const { data: subcategoryTags, error } = await getTagsBySubcategory(
          Number(subcategoryId)
        );
        if (error) {
          showErrorToast({ message: "Failed to fetch tags" });
          return;
        }
        if (subcategoryTags) {
          setTags(subcategoryTags);
          // Only reset tags if we're not in edit mode
          if (!article?.id) {
            setSelectedTags([]);
            setValue("tag_ids", []);
          }
        }
      } else {
        setTags([]);
        // Only reset tags if we're not in edit mode
        if (!article?.id) {
          setSelectedTags([]);
          setValue("tag_ids", []);
        }
      }
    };

    fetchTags();
  }, [subcategoryId, article?.id, setValue]);

  // Handle tag selection changes
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value)
    );
    setSelectedTags(selectedOptions);
    setValue("tag_ids", selectedOptions);
  };

  // Handle file upload with validation
  const handleFileUpload = useCallback(async ({ file, type }: { file: File; type: "image" | "video" }) => {
    try {
      if (type === "image" && !file.type.startsWith("image/")) {
        showErrorToast({ message: "Please select an image file" });
        return;
      }
      if (type === "video" && !file.type.startsWith("video/")) {
        showErrorToast({ message: "Please select a video file" });
        return;
      }

      if (type === "image" && file.size > 100 * 1024 * 1024) {
        showErrorToast({ message: "Image file size must be less than 100MB" });
        return;
      }
      if (type === "video" && file.size > 500 * 1024 * 1024) {
        showErrorToast({ message: "Video file size must be less than 500MB" });
        return;
      }

      if (type === "image") {
        setSelectedImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        showSuccessToast({ message: "Image selected successfully" });
      } else {
        setSelectedVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
        showSuccessToast({ message: "Video selected successfully" });
      }
    } catch (error) {
      showErrorToast({ message: `Error selecting ${type}` });
    }
  }, []);

  // Handle media removal
  const handleRemoveMedia = useCallback(({ type }: { type: "image" | "video" }) => {
    if (type === "image") {
      setImageUrl("");
      setSelectedImageFile(null);
      setValue("image", "");
    } else {
      setVideoUrl("");
      setSelectedVideoFile(null);
      setValue("video", "");
    }
    showSuccessToast({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully` });
  }, [setValue]);

  // Handle category selection and reset dependent fields
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      setValue("category_id", parseInt(categoryId, 10));
    } else {
      setValue("category_id", undefined as unknown as number);
    }
    setValue("sub_category_id", undefined as unknown as number); // Reset subcategory when category changes
    setSelectedTags([]);
    setValue("tag_ids", []);
  };

  // Handle form submission for create and update
  const onSubmit = async (data: ArticleFormData) => {
    try {
      setIsSubmitting(true);
      // Convert string fields to numbers as needed
      const fixedData = {
        ...data,
        category_id: data.category_id ? Number(data.category_id) : undefined,
        author_id: data.author_id ? Number(data.author_id) : undefined,
        sub_category_id: data.sub_category_id ? Number(data.sub_category_id) : undefined,
        tag_ids: Array.isArray(data.tag_ids) ? data.tag_ids.map((id) => Number(id)) : [],
      };

      if (article?.id) {
        try {
          // Handle image changes
          let finalImageUrl = article.image || "";
          if (selectedImageFile) {
            const imageResult = await uploadToCloudinary(selectedImageFile, "image");
            if (!imageResult.success || !imageResult.url) {
              throw new Error(imageResult.error || "Failed to upload image");
            }
            finalImageUrl = imageResult.url;
          }

          // Handle video changes
          let finalVideoUrl = article.video || "";
          if (selectedVideoFile) {
            const videoResult = await uploadToCloudinary(selectedVideoFile, "video");
            if (!videoResult.success || !videoResult.url) {
              throw new Error(videoResult.error || "Failed to upload video");
            }
            finalVideoUrl = videoResult.url;
          }

          // Prepare update data with final media URLs
          const updateData = {
            ...fixedData,
            image: finalImageUrl,
            video: finalVideoUrl,
          };

          await updateArticle(
            article.id,
            updateData as Partial<Article>,
            selectedTags
          );
          showSuccessToast({ message: "Article updated successfully" });
          router.push("/dashboard/articles");
          router.refresh();
        } catch (updateError) {
          throw updateError;
        }
      } else {
        // Handle new article creation
        try {
          // Upload files if they exist
          if (selectedImageFile) {
            const imageResult = await uploadToCloudinary(selectedImageFile, "image");
            if (!imageResult.success || !imageResult.url) {
              throw new Error(imageResult.error || "Failed to upload image");
            }
            fixedData.image = imageResult.url;
          }

          if (selectedVideoFile) {
            const videoResult = await uploadToCloudinary(selectedVideoFile, "video");
            if (!videoResult.success || !videoResult.url) {
              throw new Error(videoResult.error || "Failed to upload video");
            }
            fixedData.video = videoResult.url;
          }

          const createResult = await createArticle(
            fixedData as unknown as Article,
            selectedTags
          );
          
          if (createResult.error) {
            throw new Error(createResult.error);
          }
          
          showSuccessToast({ message: "Article created successfully" });
          router.push("/dashboard/articles");
          router.refresh();
        } catch (createError) {
          throw createError;
        }
      }
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to submit article",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormEmpty =
    !titleValue.trim() || !contentValue.trim();

  // Return form state and handlers
  return {
    register,
    handleSubmit,
    formState,
    isSubmitting,
    activeTab,
    setActiveTab,
    selectedCategory,
    selectedTags,
    filteredSubcategories,
    tags,
    imageUrl,
    videoUrl,
    handleTagChange,
    handleFileUpload,
    handleCategoryChange,
    handleRemoveMedia,
    onSubmit,
    isFormEmpty,
    isEditMode: !!article,
  };
}

export type UseArticleFormResult = ReturnType<typeof useArticleForm>;
