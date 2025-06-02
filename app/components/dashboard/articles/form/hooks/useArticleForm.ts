import { useState, useEffect } from "react";
import { useForm, Control } from "react-hook-form";
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
} from "../../../../../lib/definition";
import { articleSchema, ArticleFormData } from "../articleSchema";

interface UseArticleFormProps {
  article?: Partial<Article>;
  categories: Category[];
  authors: Author[];
  subcategories: SubCategory[];
  users: User[];
  tags: Tag[];
}

export function useArticleForm({
  article,
  categories,
  authors,
  subcategories,
  users,
  tags,
}: UseArticleFormProps) {
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
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    image?: number;
    video?: number;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
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
    mode: "onChange",
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
      } else {
        setSelectedVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
      }

      toast.success(`${type} selected successfully`);
    } catch (error) {
      toast.error(`Error selecting ${type}`);
      console.error(`Error selecting ${type}:`, error);
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
    try {
      setIsSubmitting(true);

      // Upload files if they exist
      if (selectedImageFile) {
        const imageResult = await uploadToCloudinary(
          selectedImageFile,
          "image"
        );
        if (!imageResult.success || !imageResult.url) {
          throw new Error(imageResult.error || "Failed to upload image");
        }
        data.image = imageResult.url;
      }

      if (selectedVideoFile) {
        const videoResult = await uploadToCloudinary(
          selectedVideoFile,
          "video"
        );
        if (!videoResult.success || !videoResult.url) {
          throw new Error(videoResult.error || "Failed to upload video");
        }
        data.video = videoResult.url;
      }

      const now = new Date();
      const articleData: Article = {
        id: article?.id || 0,
        title: data.title,
        content: data.content,
        category_id: data.category_id,
        author_id: data.author_id,
        user_id: data.user_id,
        sub_category_id: data.sub_category_id,
        image: data.image || undefined,
        video: data.video || undefined,
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

  const formValues = watch();
  const isFormEmpty = !formValues.title.trim() || !formValues.content.trim();

  return {
    register,
    handleSubmit,
    errors,
    control,
    isSubmitting,
    activeTab,
    setActiveTab,
    selectedCategory,
    selectedTags,
    filteredSubcategories,
    imageUrl,
    videoUrl,
    uploadProgress,
    handleTagChange,
    handleFileUpload,
    handleCategoryChange,
    onSubmit,
    isFormEmpty,
    isEditMode: !!article,
  };
}
