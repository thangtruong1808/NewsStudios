import { getArticles } from "@/app/lib/actions/articles";
import CreateVideoPageClient from "@/app/components/dashboard/videos/CreateVideoPageClient";

export default async function CreateVideoPage() {
  try {
    console.log("Fetching articles for video creation...");
    const articlesResult = await getArticles({
      limit: 1000,
      sortField: "title",
      sortDirection: "asc"
    });

    if (articlesResult.error) {
      console.error("Error fetching articles:", articlesResult.error);
      throw new Error(articlesResult.error);
    }

    if (!articlesResult.data || articlesResult.data.length === 0) {
      console.log("No articles found in the database");
    } else {
      console.log(`Found ${articlesResult.data.length} articles`);
    }

    return <CreateVideoPageClient articles={articlesResult.data || []} />;
  } catch (error) {
    console.error("Error in CreateVideoPage:", error);
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
