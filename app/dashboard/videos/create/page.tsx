import { getArticles } from "@/app/lib/actions/articles";
import CreateVideoPageClient from "@/app/components/dashboard/videos/CreateVideoPageClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Video | NewsStudios',
  description: 'Create a new video, media content, and gallery in one place',
  keywords: ['videos', 'media management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default async function CreateVideoPage() {
  try {
    const articlesResult = await getArticles({
      limit: 1000,
      sortField: "title",
      sortDirection: "asc"
    });

    if (articlesResult.error) {
      throw new Error(articlesResult.error);
    }

    return <CreateVideoPageClient articles={articlesResult.data || []} />;
  } catch (error) {
    return (
      <div className="w-full">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading articles
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error instanceof Error ? error.message : "Failed to load articles"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
