import { getVideoById } from "@/app/lib/actions/videos";
import { getArticles } from "@/app/lib/actions/articles";
import CreateVideoPageClient from "@/app/components/dashboard/videos/CreateVideoPageClient";
import { Metadata } from 'next';

import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Edit Video | NewsStudios',
  description: 'Edit your video, media content, and gallery in one place',
  keywords: ['videos', 'media management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

interface EditVideoPageProps {
  params: {
    id: string;
  };
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const [videoResult, articlesResult] = await Promise.all([
    getVideoById(parseInt(params.id)),
    getArticles({ limit: 1000 }),
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
