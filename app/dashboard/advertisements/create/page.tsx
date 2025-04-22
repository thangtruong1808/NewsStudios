import { query } from "@/app/lib/db/query";
import CreateAdvertisementPageClient from "@/app/components/dashboard/advertisements/CreateAdvertisementPageClient";
import { Sponsor, Article, Category } from "@/app/lib/definition";

// Helper function to add a small delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to ensure data is serializable
const serializeData = <T extends { id: number; [key: string]: any }>(
  data: T[],
  fields: (keyof T)[]
): T[] => {
  return data.map((item) => {
    const serialized: any = {};
    fields.forEach((field) => {
      const value = item[field];
      serialized[field] =
        typeof value === "string"
          ? String(value)
          : typeof value === "number"
          ? Number(value)
          : value === null
          ? null
          : String(value);
    });
    return serialized as T;
  });
};

export default async function CreateAdvertisementPage() {
  try {
    console.log("Fetching data for advertisements page...");

    // Fetch data sequentially with small delays to ensure connections are released
    const sponsorsResult = await query("SELECT id, name FROM Sponsors");
    await delay(100); // Small delay to ensure connection is released
    const articlesResult = await query("SELECT id, title FROM Articles");
    await delay(100); // Small delay to ensure connection is released
    const categoriesResult = await query("SELECT id, name FROM Categories");

    // Log the results for debugging
    console.log("Query results:", {
      sponsors: sponsorsResult,
      articles: articlesResult,
      categories: categoriesResult,
    });

    if (
      sponsorsResult.error ||
      articlesResult.error ||
      categoriesResult.error
    ) {
      const errors = {
        sponsors: sponsorsResult.error,
        articles: articlesResult.error,
        categories: categoriesResult.error,
      };
      console.error("Database query errors:", errors);

      // Return a more detailed error message
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Failed to load required data. Please try again later.</p>
                <p className="mt-1">
                  {Object.entries(errors)
                    .filter(([_, error]) => error)
                    .map(([source, error]) => `${source}: ${error}`)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Ensure data exists before mapping
    if (
      !sponsorsResult.data ||
      !articlesResult.data ||
      !categoriesResult.data
    ) {
      console.error("Missing data in query results");
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>No data available. Please check the database connection.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Format the data to ensure proper serialization
    const sponsors = sponsorsResult.data.map((sponsor: any) => ({
      id: Number(sponsor.id),
      name: String(sponsor.name),
    }));

    const articles = articlesResult.data.map((article: any) => ({
      id: Number(article.id),
      title: String(article.title),
    }));

    const categories = categoriesResult.data.map((category: any) => ({
      id: Number(category.id),
      name: String(category.name),
    }));

    // Log the formatted data for debugging
    console.log("Formatted data:", {
      sponsors,
      articles,
      categories,
    });

    return (
      <CreateAdvertisementPageClient
        sponsors={sponsors}
        articles={articles}
        categories={categories}
      />
    );
  } catch (error) {
    console.error("Unexpected error in CreateAdvertisementPage:", error);
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
