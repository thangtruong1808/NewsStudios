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
      <div className="w-full">
        <FormSkeleton
          fields={3} // Number of fields in the photo form: photo upload, article selection, description
          showHeader={true}
          showActions={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full">
      <CreatePhotoPageClient articles={data.articles} image={data.image} />
    </div>
  );
}
