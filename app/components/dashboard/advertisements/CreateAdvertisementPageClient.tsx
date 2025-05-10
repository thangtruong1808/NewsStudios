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

  const handleSubmit = async (data: {
    sponsor_id: number;
    article_id?: number;
    category_id?: number;
    ad_type: "banner" | "video";
    ad_content: string;
    start_date: string;
    end_date: string;
    image_url: string | null;
    video_url: string | null;
  }) => {
    try {
      setIsSubmitting(true);

      // Ensure all data is serializable
      const serializableData = {
        sponsor_id: Number(data.sponsor_id),
        article_id: data.article_id ? Number(data.article_id) : undefined,
        category_id: data.category_id ? Number(data.category_id) : undefined,
        ad_type: data.ad_type,
        ad_content: data.ad_content,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        image_url: data.image_url || null,
        video_url: data.video_url || null,
      };

      const result = await createAdvertisement(serializableData);

      if (!result.success) {
        const errorMessage =
          "error" in result ? result.error : "Failed to create advertisement";
        return { success: false, error: errorMessage };
      }

      router.push("/dashboard/advertisements");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Preparing to upload image...");
    try {
      setIsUploading(true);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file", { id: toastId });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", { id: toastId });
        return;
      }

      // Simulate validation phase
      await new Promise((res) => setTimeout(res, 1000));
      toast.loading("Validating image...", { id: toastId });

      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Simulate conversion phase
      await new Promise((res) => setTimeout(res, 1000));
      toast.loading("Converting image...", { id: toastId });

      // Simulate upload preparation
      await new Promise((res) => setTimeout(res, 1000));
      toast.loading("Preparing to upload to server...", { id: toastId });

      // Upload to Cloudinary
      const result = await uploadImageToCloudinary(base64String);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.url) {
        throw new Error("No URL returned from Cloudinary");
      }

      setImageUrl(result.url);
      toast.success("Image uploaded successfully! ✅", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image ❌",
        { id: toastId }
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

    const toastId = toast.loading("Preparing to upload video...");
    try {
      setIsUploading(true);

      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a video file", { id: toastId });
        return;
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video size should be less than 50MB", { id: toastId });
        return;
      }

      // Simulate validation phase
      await new Promise((res) => setTimeout(res, 1000));
      toast.loading("Validating video...", { id: toastId });

      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Simulate conversion phase
      await new Promise((res) => setTimeout(res, 1000));
      toast.loading("Converting video...", { id: toastId });

      // Simulate upload preparation
      await new Promise((res) => setTimeout(res, 1000));
      toast.loading("Preparing to upload to server...", { id: toastId });

      // Upload to Cloudinary
      const result = await uploadVideoToCloudinary(base64String);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.url) {
        throw new Error("No URL returned from Cloudinary");
      }

      setVideoUrl(result.url);
      toast.success("Video uploaded successfully! ✅", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload video ❌",
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
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
