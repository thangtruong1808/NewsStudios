"use client";

import { Sponsor, Article, Category } from "@/app/lib/definition";
import CreateAdvertisementForm from "./CreateAdvertisementForm";
import { useState, useEffect } from "react";
import { createAdvertisement } from "@/app/lib/actions/advertisements";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after component mounts
    setIsLoading(false);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      // Convert FormData to a plain object with serializable values
      const data = {
        sponsor_id: Number(formData.get("sponsor_id")),
        article_id: Number(formData.get("article_id")),
        category_id: Number(formData.get("category_id")),
        ad_type: String(formData.get("ad_type")) as "banner" | "video",
        ad_content: String(formData.get("ad_content")),
        start_date: String(formData.get("start_date")),
        end_date: String(formData.get("end_date")),
        image_url: formData.get("image_url")
          ? String(formData.get("image_url"))
          : undefined,
        video_url: formData.get("video_url")
          ? String(formData.get("video_url"))
          : undefined,
      };

      // Validate required fields
      if (
        !data.sponsor_id ||
        !data.article_id ||
        !data.category_id ||
        !data.ad_type ||
        !data.start_date ||
        !data.end_date
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate dates
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      if (endDate <= startDate) {
        toast.error("End date must be after start date");
        return;
      }

      const result = await createAdvertisement(data);

      if (result.error) {
        console.error("Advertisement creation error:", result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Advertisement created successfully");
      router.push("/dashboard/advertisements");
      router.refresh();
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create advertisement"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Create New Advertisement</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

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
        />
      </div>
    </div>
  );
}
