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

      // Get raw form values
      const sponsorId = formData.get("sponsor_id");
      const articleId = formData.get("article_id");
      const categoryId = formData.get("category_id");
      const adType = formData.get("ad_type");
      const adContent = formData.get("ad_content");
      const startDate = formData.get("start_date");
      const endDate = formData.get("end_date");

      // Validate required fields
      if (
        !sponsorId ||
        !articleId ||
        !categoryId ||
        !adType ||
        !adContent ||
        !startDate ||
        !endDate
      ) {
        throw new Error("All required fields must be filled out");
      }

      // Convert and validate numeric IDs
      const sponsor_id = parseInt(sponsorId as string, 10);
      const article_id = parseInt(articleId as string, 10);
      const category_id = parseInt(categoryId as string, 10);

      if (isNaN(sponsor_id) || isNaN(article_id) || isNaN(category_id)) {
        throw new Error("Invalid ID values. Please select valid options.");
      }

      // Validate ad type
      if (adType !== "banner" && adType !== "video") {
        throw new Error("Invalid advertisement type");
      }

      // Construct the data object with proper types
      const data = {
        sponsor_id,
        article_id,
        category_id,
        ad_type: adType as "banner" | "video",
        ad_content: adContent as string,
        start_date: startDate as string,
        end_date: endDate as string,
        image_url: imageUrl || undefined,
        video_url: videoUrl || undefined,
      };

      console.log("Submitting data:", data);

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
      toast.loading("Uploading image...");

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file");
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image file size should be less than 10MB");
      }

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

      if (!result.url) {
        throw new Error("No URL returned from Cloudinary");
      }

      setImageUrl(result.url);
      toast.dismiss();
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss();
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
      toast.loading("Uploading video...");

      // Validate file type
      if (!file.type.startsWith("video/")) {
        throw new Error("Please select a valid video file");
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("Video file size should be less than 50MB");
      }

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

      if (!result.url) {
        throw new Error("No URL returned from Cloudinary");
      }

      setVideoUrl(result.url);
      toast.dismiss();
      toast.success("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.dismiss();
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
