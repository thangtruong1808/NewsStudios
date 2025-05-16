"use client";

import { useEffect, useState } from "react";
import { getVideoById } from "@/app/lib/actions/videos";
import { getArticles } from "@/app/lib/actions/articles";
import CreateVideoPageClient from "@/app/components/dashboard/videos/CreateVideoPageClient";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

interface EditVideoPageProps {
  params: {
    id: string;
  };
}

export default function EditVideoPage({ params }: EditVideoPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    video: any;
    articles: any[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoResult, articlesResult] = await Promise.all([
          getVideoById(parseInt(params.id)),
          getArticles(),
        ]);

        if (videoResult.error || !videoResult.data) {
          setError("Video not found");
          return;
        }

        if (articlesResult.error) {
          setError(articlesResult.error);
          return;
        }

        setData({
          video: videoResult.data,
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
              fields={3} // Number of fields in the video form: article selection, video upload, description
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

  return <CreateVideoPageClient articles={data.articles} video={data.video} />;
}
