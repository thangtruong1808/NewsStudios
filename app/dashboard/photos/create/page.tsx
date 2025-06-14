import { getArticles } from "@/app/lib/actions/articles";
import CreatePhotoPageClient from "@/app/components/dashboard/photos/CreatePhotoPageClient";
import { Article } from "@/app/lib/definition";

export default async function CreatePhotoPage() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    console.log("Fetching articles for photo creation...");
    const result = await getArticles({
      limit: 1000,
      sortField: "title",
      sortDirection: "asc",
    });

    console.log("Articles fetch result:", result);

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.data || result.data.length === 0) {
      console.log("No articles found in the database");
    } else {
      console.log(`Found ${result.data.length} articles`);
    }

    articles = result.data || [];
  } catch (err) {
    console.error("Error fetching articles:", err);
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
