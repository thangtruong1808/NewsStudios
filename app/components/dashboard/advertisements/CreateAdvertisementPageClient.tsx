"use client";

import { Sponsor, Article, Category } from "@/app/lib/definition";
import CreateAdvertisementForm from "./CreateAdvertisementForm";
import { useState } from "react";
import { createAdvertisement } from "@/app/lib/actions/advertisements";
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/app/lib/actions/cloudinary";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CreateAdvertisementPageClientProps {
  sponsors: Pick<Sponsor, "id" | "name">[];
  articles: Pick<Article, "id" | "title">[];
  categories: Pick<Category, "id" | "name">[];
}

export default function CreateAdvertisementPageClient({
  sponsors,
  articles,
  categories,
}: CreateAdvertisementPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      // Convert FormData to a plain object with only serializable values
      const data = {
        sponsor_id: parseInt(formData.get("sponsor_id") as string),
        article_id: parseInt(formData.get("article_id") as string),
        category_id: parseInt(formData.get("category_id") as string),
        ad_type: formData.get("ad_type") as "banner" | "video",
        ad_content: formData.get("ad_content") as string,
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string,
        image_url: imageUrl || undefined,
        video_url: videoUrl || undefined,
      };

      const result = await createAdvertisement(data);
      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Advertisement created successfully!");
      router.push("/dashboard/advertisements");
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Convert file to base64 string
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to Cloudinary and get secure URL
      const result = await uploadImageToCloudinary(base64String);
      if (result.error) {
        throw new Error(result.error);
      }

      setImageUrl(result.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Convert file to base64 string
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to Cloudinary and get secure URL
      const result = await uploadVideoToCloudinary(base64String);
      if (result.error) {
        throw new Error(result.error);
      }

      setVideoUrl(result.url);
      toast.success("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Advertisement
        </h1>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <CreateAdvertisementForm
          sponsors={sponsors}
          articles={articles}
          categories={categories}
          onSubmit={handleSubmit}
          onImageFileChange={handleImageFileChange}
          onVideoFileChange={handleVideoFileChange}
          isUploading={isUploading}
          imageUrl={imageUrl}
          videoUrl={videoUrl}
        />
      </div>
    </div>
  );
}
