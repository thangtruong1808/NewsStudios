"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createArticle,
  updateArticle,
} from "../../../../../lib/actions/articles";
import { uploadToCloudinary } from "../../../../../lib/utils/cloudinaryUtils";
import {
  Article,
  Category,
  Author,
  SubCategory,
  Tag,
  User,
  CreateArticleData,
} from "../../../../../lib/definition";
import { articleSchema, ArticleFormData } from "../articleSchema";
import { getTagsBySubcategory } from "@/app/lib/actions/tags";

interface UseArticleFormProps {
  article?: Partial<Article>;
  categories: Category[];
  authors: Author[];
  subcategories: SubCategory[];
  tags: Tag[];
  userId?: number;
}

interface UseArticleFormReturn extends Omit<UseFormReturn<ArticleFormData>, 'getValues'> {
  formState: UseFormReturn<ArticleFormData>["formState"];
  isSubmitting: boolean;
  activeTab: "basic" | "content" | "media" | "settings";
  setActiveTab: (tab: "basic" | "content" | "media" | "settings") => void;
  selectedCategory: string;
  selectedTags: number[];
  filteredSubcategories: SubCategory[];
  tags: Tag[];
  imageUrl: string;
  videoUrl: string;
  uploadProgress: { image?: number; video?: number };
  handleTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFileUpload: (file: File, type: "image" | "video") => Promise<void>;
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleRemoveMedia: (type: "image" | "video") => void;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  isFormEmpty: boolean;
  isEditMode: boolean;
  getValues: UseFormReturn<ArticleFormData>["getValues"];
}

export function useArticleForm({
  article,
  categories,
  authors,
  subcategories,
  tags: initialTags,
  userId,
}: UseArticleFormProps): UseArticleFormReturn {
  console.log('[DEBUG] useArticleForm initialized');
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
  const [uploadProgress, setUploadProgress] = useState<{
    image?: number;
    video?: number;
  }>({});

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
  const { register, handleSubmit, control, getValues } = form;

  // Initialize form with article data
  useEffect(() => {
    if (article) {
      console.log("Initializing form with article data:", article);
      form.setValue("title", article.title || "");
      form.setValue("content", article.content || "");
      if (article.category_id) {
        form.setValue("category_id", article.category_id);
        setSelectedCategory(article.category_id.toString());
        // Filter subcategories immediately
        const filtered = subcategories.filter(
          (sub) =>
            sub.category_id.toString() === article.category_id?.toString()
        );
        setFilteredSubcategories(filtered);
      }
      if (article.author_id) form.setValue("author_id", article.author_id);
      form.setValue("user_id", userId || article.user_id);
      if (article.sub_category_id) {
        form.setValue("sub_category_id", article.sub_category_id);
        // Set initial tags immediately if we have a subcategory
        const fetchInitialTags = async () => {
          if (article.sub_category_id) {
            const { data: subcategoryTags, error } = await getTagsBySubcategory(
              article.sub_category_id
            );
            if (!error && subcategoryTags) {
              setTags(subcategoryTags);
            }
          }
        };
        fetchInitialTags();
      }
      form.setValue("image", article.image || "");
      form.setValue("video", article.video || "");
      form.setValue("is_featured", article.is_featured || false);
      form.setValue("headline_priority", article.headline_priority || 0);
      form.setValue("is_trending", article.is_trending || false);
      form.setValue("tag_ids", article.tag_ids || []);

      // Set other state values
      setSelectedTags(article.tag_ids || []);
      setImageUrl(article.image || "");
      setVideoUrl(article.video || "");
    }
  }, [article, form, userId, subcategories]);

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
    const subcategoryId = form.watch("sub_category_id");
    const fetchTags = async () => {
      if (subcategoryId) {
        // console.log("Fetching tags for subcategory:", subcategoryId);
        const { data: subcategoryTags, error } = await getTagsBySubcategory(
          Number(subcategoryId)
        );
        if (error) {
          console.error("Error fetching tags:", error);
          toast.error("Failed to fetch tags");
          return;
        }
        if (subcategoryTags) {
          console.log("Fetched tags:", subcategoryTags);
          setTags(subcategoryTags);
          // Only reset tags if we're not in edit mode
          if (!article?.id) {
            setSelectedTags([]);
            form.setValue("tag_ids", []);
          }
        }
      } else {
        console.log("No subcategory selected, clearing tags");
        setTags([]);
        // Only reset tags if we're not in edit mode
        if (!article?.id) {
          setSelectedTags([]);
          form.setValue("tag_ids", []);
        }
      }
    };

    fetchTags();
  }, [form.watch("sub_category_id"), form.setValue, article?.id]);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value)
    );
    setSelectedTags(selectedOptions);
    form.setValue("tag_ids", selectedOptions);
  };

  const handleFileUpload = useCallback(async (file: File, type: "image" | "video") => {
    try {
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

      if (type === "image") {
        setSelectedImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setUploadProgress(prev => ({ ...prev, image: 0 }));
        toast.success("Image selected successfully");
      } else {
        setSelectedVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
        setUploadProgress(prev => ({ ...prev, video: 0 }));
        toast.success("Video selected successfully");
      }
    } catch (error) {
      toast.error(`Error selecting ${type}`);
      console.error(`Error selecting ${type}:`, error);
    }
  }, []);

  const handleRemoveMedia = useCallback((type: "image" | "video") => {
    if (type === "image") {
      setImageUrl("");
      setSelectedImageFile(null);
      form.setValue("image", "");
      setUploadProgress(prev => ({ ...prev, image: undefined }));
    } else {
      setVideoUrl("");
      setSelectedVideoFile(null);
      form.setValue("video", "");
      setUploadProgress(prev => ({ ...prev, video: undefined }));
    }
    toast.success(`${type} removed successfully`);
  }, [form]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    form.setValue("category_id", categoryId ? parseInt(categoryId) : 0);
    form.setValue("sub_category_id", 0); // Reset subcategory when category changes
  };

  const onSubmit = async (data: ArticleFormData) => {
    console.log("[DEBUG] onSubmit called with data:", data);
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
        console.log("[DEBUG] Updating article");
        try {
          // Handle image changes
          let finalImageUrl = article.image || "";
          if (selectedImageFile) {
            console.log("[DEBUG] Uploading new image to Cloudinary");
            const imageResult = await uploadToCloudinary(selectedImageFile, "image");
            if (!imageResult.success || !imageResult.url) {
              throw new Error(imageResult.error || "Failed to upload image");
            }
            finalImageUrl = imageResult.url;
          }

          // Handle video changes
          let finalVideoUrl = article.video || "";
          if (selectedVideoFile) {
            console.log("[DEBUG] Uploading new video to Cloudinary");
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

          console.log("[DEBUG] Updating article with data:", updateData);
          const result = await updateArticle(article.id, updateData as Partial<Article>, selectedTags);
          console.log("[DEBUG] Update result:", result);
          toast.success("Article updated successfully", {
            duration: 3000,
          });
          router.push("/dashboard/articles");
          router.refresh();
        } catch (updateError) {
          console.error("[DEBUG] Error updating article:", updateError);
          throw updateError;
        }
      } else {
        // Handle new article creation
        console.log("[DEBUG] Creating new article");
        try {
          // Upload files if they exist
          if (selectedImageFile) {
            console.log("[DEBUG] Uploading image file...");
            const imageResult = await uploadToCloudinary(selectedImageFile, "image");
            if (!imageResult.success || !imageResult.url) {
              throw new Error(imageResult.error || "Failed to upload image");
            }
            fixedData.image = imageResult.url;
          }

          if (selectedVideoFile) {
            console.log("[DEBUG] Uploading video file...");
            const videoResult = await uploadToCloudinary(selectedVideoFile, "video");
            if (!videoResult.success || !videoResult.url) {
              throw new Error(videoResult.error || "Failed to upload video");
            }
            fixedData.video = videoResult.url;
          }

          const result = await createArticle(fixedData as unknown as Article, selectedTags);
          console.log("[DEBUG] Create result:", result);
          toast.success("Article created successfully", {
            duration: 3000,
          });
          router.push("/dashboard/articles");
          router.refresh();
        } catch (createError) {
          console.error("[DEBUG] Error creating article:", createError);
          throw createError;
        }
      }
    } catch (error) {
      console.error("[DEBUG] Error in form submission:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit article"
      );
    } finally {
      setIsSubmitting(false);
      console.log("[DEBUG] Form submission finished");
    }
  };

  const formValues = form.watch();
  const isFormEmpty = !formValues.title.trim() || !formValues.content.trim();

  // Debug: Log subcategory, selected tags, and form values on every render
  useEffect(() => {
    const subcategoryId = form.watch("sub_category_id");
    const tagIds = form.watch("tag_ids");
    console.log("[DEBUG] Current subcategoryId:", subcategoryId);
    console.log("[DEBUG] Current selectedTags state:", selectedTags);
    console.log("[DEBUG] Current tag_ids in form:", tagIds);
    console.log("[DEBUG] Current form values:", form.watch());
  });

  return {
    ...form,
    formState: form.formState,
    isSubmitting,
    activeTab,
    setActiveTab: (tab: "basic" | "content" | "media" | "settings") =>
      setActiveTab(tab),
    selectedCategory,
    selectedTags,
    filteredSubcategories,
    tags,
    imageUrl,
    videoUrl,
    uploadProgress,
    handleTagChange,
    handleFileUpload,
    handleCategoryChange,
    handleRemoveMedia,
    onSubmit,
    isFormEmpty,
    isEditMode: !!article,
    getValues,
  };
}
