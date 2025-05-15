import { getImageById } from "@/app/lib/actions/images";
import { getArticles } from "@/app/lib/actions/articles";
import CreatePhotoPageClient from "@/app/components/dashboard/photos/CreatePhotoPageClient";
import { notFound } from "next/navigation";

interface EditPhotoPageProps {
  params: {
    id: string;
  };
}

export default async function EditPhotoPage({ params }: EditPhotoPageProps) {
  const [imageResult, articlesResult] = await Promise.all([
    getImageById(parseInt(params.id)),
    getArticles(),
  ]);

  if (imageResult.error || !imageResult.data) {
    notFound();
  }

  if (articlesResult.error) {
    throw new Error(articlesResult.error);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <CreatePhotoPageClient
            articles={articlesResult.data || []}
            image={{
              ...imageResult.data,
              description: imageResult.data.description || null,
              type: "gallery",
              entity_type: "article",
              entity_id: imageResult.data.article_id || 0,
              is_featured: false,
              display_order: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
