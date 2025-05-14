import { getArticles } from "../../../lib/actions/articles";
import CreatePhotoPageClient from "@/app/components/dashboard/photos/CreatePhotoPageClient";
import { Article } from "../../../lib/definition";

export default async function CreatePhotoPage() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    const result = await getArticles();
    if (result.error) {
      throw new Error(result.error);
    }
    articles = result.data;
  } catch (err) {
    console.error("Error fetching articles:", err);
    error = err instanceof Error ? err.message : "Failed to fetch articles";
  }

  if (error) {
    return (
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
    );
  }

  return <CreatePhotoPageClient articles={articles} />;
}
