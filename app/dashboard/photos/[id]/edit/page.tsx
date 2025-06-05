import { getImageById } from "@/app/lib/actions/images";
import { getArticles } from "@/app/lib/actions/articles";
import EditPhotoPageClient from "@/app/components/dashboard/photos/EditPhotoPageClient";
import { notFound } from "next/navigation";
import { Image } from "@/app/lib/definition";

interface EditPhotoPageProps {
  params: {
    id: string;
  };
}

export default async function EditPhotoPage({ params }: EditPhotoPageProps) {
  const { id } = params;

  try {
    // Fetch photo and articles data
    const [imageResult, articlesResult] = await Promise.all([
      getImageById(parseInt(id)),
      getArticles({ page: 1, limit: 100 }),
    ]);

    const { data: photo, error: photoError } = imageResult;

    if (photoError || !photo) {
      notFound();
    }

    // Ensure photo has all required Image properties
    const fullPhoto: Image = {
      id: photo.id,
      image_url: photo.image_url,
      description: photo.description || null,
      entity_id: photo.article_id || 0,
      entity_type: "article",
      type: "gallery",
      is_featured: false,
      display_order: 0,
      created_at: photo.created_at,
      updated_at: photo.updated_at,
      article_id: photo.article_id || 0,
    };

    // Handle articles data
    if (!articlesResult || articlesResult.error) {
      console.error("Error fetching articles:", articlesResult?.error);
      throw new Error(articlesResult?.error || "Failed to fetch articles");
    }

    const articles = articlesResult.data || [];

    return (
      <div className="w-full">
        <EditPhotoPageClient photo={fullPhoto} articles={articles} />
      </div>
    );
  } catch (error) {
    console.error("Error in EditPhotoPage:", error);
    return (
      <div className="w-full">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load data"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
