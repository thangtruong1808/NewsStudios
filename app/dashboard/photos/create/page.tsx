import { getArticles } from "@/app/lib/actions/articles";
import CreatePhotoPageClient from "@/app/components/dashboard/photos/CreatePhotoPageClient";
import { Article } from "@/app/lib/definition";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Photo | NewsStudios',
  description: 'Create a new photo, media content, and gallery in one place',
  keywords: ['photos', 'media management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default async function CreatePhotoPage() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    const result = await getArticles({
      limit: 1000,
      sortField: "title",
      sortDirection: "asc",
    });

    if (result.error) {
      throw new Error(result.error);
    }

    articles = result.data || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch articles";
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading articles
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CreatePhotoPageClient articles={articles} />
    </div>
  );
}
