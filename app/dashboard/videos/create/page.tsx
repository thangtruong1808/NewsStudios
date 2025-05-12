import { getArticles } from "@/app/lib/actions/articles";
import CreateVideoPageClient from "@/app/components/dashboard/videos/CreateVideoPageClient";
import { Article } from "@/app/lib/definition";

// Helper function to clean up any object for safe passing
function serializeForClient<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export default async function CreateVideoPage() {
  try {
    const result = await getArticles();
    if (result.error) {
      throw new Error(result.error);
    }
    const serializedArticles = serializeForClient(result.data);

    return <CreateVideoPageClient articles={serializedArticles} />;
  } catch (error) {
    console.error("Unexpected error in CreateVideoPage:", error);
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Unexpected error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                {error instanceof Error
                  ? error.message
                  : "An unknown error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
