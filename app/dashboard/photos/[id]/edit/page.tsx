"use client";

import { useEffect, useState } from "react";
import { getImageById } from "@/app/lib/actions/images";
import { getArticles } from "@/app/lib/actions/articles";
import CreatePhotoPageClient from "@/app/components/dashboard/photos/CreatePhotoPageClient";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

interface EditPhotoPageProps {
  params: {
    id: string;
  };
}

export default function EditPhotoPage({ params }: EditPhotoPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    image: any;
    articles: any[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imageResult, articlesResult] = await Promise.all([
          getImageById(parseInt(params.id)),
          getArticles(),
        ]);

        if (imageResult.error || !imageResult.data) {
          setError("Photo not found");
          return;
        }

        if (articlesResult.error) {
          setError(articlesResult.error);
          return;
        }

        setData({
          image: {
            ...imageResult.data,
            description: imageResult.data.description || null,
            type: "gallery",
            entity_type: "article",
            entity_id: imageResult.data.article_id || 0,
            is_featured: false,
            display_order: 0,
          },
          articles: articlesResult.data || [],
        });
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <FormSkeleton
              fields={3} // Number of fields in the photo form: photo upload, article selection, description
              showHeader={true}
              showActions={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
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
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <CreatePhotoPageClient articles={data.articles} image={data.image} />
        </div>
      </div>
    </div>
  );
}
