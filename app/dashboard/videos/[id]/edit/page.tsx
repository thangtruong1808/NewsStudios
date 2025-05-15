import { getVideoById } from "@/app/lib/actions/videos";
import { getArticles } from "@/app/lib/actions/articles";
import CreateVideoPageClient from "@/app/components/dashboard/videos/CreateVideoPageClient";
import { notFound } from "next/navigation";

interface EditVideoPageProps {
  params: {
    id: string;
  };
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const [videoResult, articlesResult] = await Promise.all([
    getVideoById(parseInt(params.id)),
    getArticles(),
  ]);

  if (videoResult.error || !videoResult.data) {
    notFound();
  }

  if (articlesResult.error) {
    throw new Error(articlesResult.error);
  }

  return (
    <CreateVideoPageClient
      articles={articlesResult.data || []}
      video={videoResult.data}
    />
  );
}
