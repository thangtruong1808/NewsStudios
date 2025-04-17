"use client";

import { getSponsors } from "../../../lib/actions/sponsors";
import { getArticles } from "../../../lib/actions/articles";
import { getCategories } from "../../../lib/actions/categories";
import CreateAdvertisementForm from "../../../components/dashboard/advertisements/CreateAdvertisementForm";
import { Sponsor, Article, Category } from "../../../lib/definition";
import { useEffect, useState } from "react";
import { createAdvertisement } from "../../../lib/actions/advertisements";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ActionResult<T> {
  data: T | null;
  error: string | null;
}

export default function CreateAdvertisementPage() {
  const [sponsors, setSponsors] = useState<{ id: number; name: string }[]>([]);
  const [articles, setArticles] = useState<{ id: number; title: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [sponsorsResult, articlesResult, categoriesResult] =
          await Promise.all([getSponsors(), getArticles(), getCategories()]);

        if (sponsorsResult.error || categoriesResult.error) {
          setError(sponsorsResult.error || categoriesResult.error);
          return;
        }

        setSponsors(
          (sponsorsResult.data || []).map((sponsor) => ({
            id: sponsor.id,
            name: sponsor.name,
          }))
        );

        setArticles(
          (articlesResult || []).map((article) => ({
            id: article.id,
            title: article.title,
          }))
        );

        setCategories(
          (categoriesResult.data || []).map((category) => ({
            id: category.id,
            name: category.name,
          }))
        );
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      // Extract form data
      const category_id = Number(formData.get("category_id"));
      const sponsor_id = Number(formData.get("sponsor_id"));
      const article_id = Number(formData.get("article_id"));
      const start_date = formData.get("start_date") as string;
      const end_date = formData.get("end_date") as string;
      const ad_type = formData.get("ad_type") as "banner" | "video";
      const ad_content = formData.get("ad_content") as string;
      const image_url = formData.get("image_url") as string;
      const video_url = formData.get("video_url") as string;

      // Create advertisement data
      const advertisementData = {
        category_id,
        sponsor_id,
        article_id,
        start_date,
        end_date,
        ad_type,
        ad_content,
        ...(image_url ? { image_url } : {}),
        ...(video_url ? { video_url } : {}),
      };

      // Create the advertisement
      const result = await createAdvertisement(advertisementData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        toast.success("Advertisement created successfully");
        router.push("/dashboard/advertisements");
        router.refresh();
      } else {
        toast.error("Failed to create advertisement");
      }
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast.error("Failed to create advertisement");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Create Advertisement
        </h1>
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
