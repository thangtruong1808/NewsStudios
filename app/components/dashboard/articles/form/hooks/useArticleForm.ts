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
import { getTagsBySubcategory } from "@/app/lib/actions/tags";

interface UseArticleFormProps {
  article?: Partial<Article>;
  categories: Category[];
  authors: Author[];
  subcategories: SubCategory[];
  tags: Tag[];
  userId?: number;
}

export function useArticleForm({
  article,
  categories,
  authors,
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
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  // Initialize form with article data
  useEffect(() => {
    if (article) {
      console.log("Initializing form with article data:", article);
      setValue("title", article.title || "");
      setValue("content", article.content || "");
      if (article.category_id) {
        setValue("category_id", article.category_id);
        setSelectedCategory(article.category_id.toString());
        // Filter subcategories immediately
        const filtered = subcategories.filter(
          (sub) =>
            sub.category_id.toString() === article.category_id?.toString()
        );
        setFilteredSubcategories(filtered);
      }
      if (article.author_id) setValue("author_id", article.author_id);
      setValue("user_id", userId || article.user_id);
      if (article.sub_category_id) {
        setValue("sub_category_id", article.sub_category_id);
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
      setValue("image", article.image || "");
      setValue("video", article.video || "");
      setValue("is_featured", article.is_featured || false);
      setValue("headline_priority", article.headline_priority || 0);
      setValue("is_trending", article.is_trending || false);
      setValue("tag_ids", article.tag_ids || []);

      // Set other state values
      setSelectedTags(article.tag_ids || []);
      setImageUrl(article.image || "");
      setVideoUrl(article.video || "");
    }
  }, [article, setValue, userId, subcategories]);

  // Update filtered subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id.toString() === selectedCategory
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  // Initialize filtered subcategories on mount if we have a category
  useEffect(() => {
    if (article?.category_id) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id.toString() === article.category_id?.toString()
      );
      setFilteredSubcategories(filtered);
    }
  }, [article?.category_id, subcategories]);

  // Add effect to fetch tags when subcategory changes
  useEffect(() => {
    const fetchTags = async () => {
      const subcategoryId = watch("sub_category_id");
      if (subcategoryId) {
        const { data: subcategoryTags, error } = await getTagsBySubcategory(
          subcategoryId
        );
        if (error) {
          console.error("Error fetching tags:", error);
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
  }, [watch("sub_category_id"), setValue, article?.id]);

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    setSelectedTags(selectedOptions);
    setValue("tag_ids", selectedOptions);
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

  const handleRemoveMedia = (type: "image" | "video") => {
    if (type === "image") {
      setImageUrl("");
      setSelectedImageFile(null);
      setValue("image", undefined);
    } else {
      setVideoUrl("");
      setSelectedVideoFile(null);
      setValue("video", undefined);
    }
    toast.success(`${type} removed successfully`);
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
      console.log("Form submission started with data:", data);
      console.log("Article ID:", article?.id);
      console.log("Selected tags:", selectedTags);

      // Validate required fields
      if (
        !data.title ||
        !data.content ||
        !data.category_id ||
        !data.author_id ||
        !userId
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Upload files if they exist
      if (selectedImageFile) {
        console.log("Uploading image file...");
        const imageResult = await uploadToCloudinary(
          selectedImageFile,
          "image"
        );
        if (!imageResult.success || !imageResult.url) {
          throw new Error(imageResult.error || "Failed to upload image");
        }
        data.image = imageResult.url;
        console.log("Image uploaded successfully:", data.image);
      }

      if (selectedVideoFile) {
        console.log("Uploading video file...");
        const videoResult = await uploadToCloudinary(
          selectedVideoFile,
          "video"
        );
        if (!videoResult.success || !videoResult.url) {
          throw new Error(videoResult.error || "Failed to upload video");
        }
        data.video = videoResult.url;
        console.log("Video uploaded successfully:", data.video);
      }

      const now = new Date();
      const articleData: Article = {
        id: article?.id || 0,
        title: data.title,
        content: data.content,
        category_id: data.category_id,
        author_id: data.author_id,
        user_id: userId,
        sub_category_id: data.sub_category_id,
        image: data.image,
        video: data.video,
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

      console.log("Prepared article data:", articleData);

      if (article?.id) {
        console.log("Updating existing article with ID:", article.id);
        // If media was removed, ensure it's passed as undefined
        if (imageUrl === "") {
          articleData.image = undefined;
        }
        if (videoUrl === "") {
          articleData.video = undefined;
        }
        try {
          const result = await updateArticle(
            article.id,
            articleData,
            selectedTags
          );
          console.log("Update result:", result);
          toast.success("Article updated successfully");
          router.push("/dashboard/articles");
          router.refresh();
        } catch (updateError) {
          console.error("Error updating article:", updateError);
          throw updateError;
        }
      } else {
        console.log("Creating new article");
        try {
          const result = await createArticle(articleData, selectedTags);
          console.log("Create result:", result);
          toast.success("Article created successfully");
          router.push("/dashboard/articles");
          router.refresh();
        } catch (createError) {
          console.error("Error creating article:", createError);
          throw createError;
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
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
  };
}
