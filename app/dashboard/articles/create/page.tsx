import { getCategories } from "../../../lib/actions/categories";
import { getAuthors } from "../../../lib/actions/authors";
import { getSubcategories } from "../../../lib/actions/subcategories";
import { getUsers } from "../../../lib/actions/users";
import { getTags } from "../../../lib/actions/tags";
import ArticleForm from "../../../components/dashboard/articles/form/ArticleForm";
import { User, Tag } from "../../../lib/definition";
import { uploadToCloudinary } from "../../../lib/utils/cloudinaryUtils";

// Helper function to add a small delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to clean up any object for safe passing
function serializeForClient<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export default async function CreateArticlePage() {
  try {
    // Fetch all required data in parallel
    const [
      categoriesResult,
      authorsResult,
      subcategoriesResult,
      usersResult,
      tagsResult,
    ] = await Promise.all([
      getCategories(),
      getAuthors(),
      getSubcategories(),
      getUsers(),
      getTags(),
    ]);

    // Extract data and ensure it's an array with proper type checking
    const categories = (categoriesResult.data ?? []).map((cat) => ({
      ...cat,
      created_at: new Date(cat.created_at),
      updated_at: new Date(cat.updated_at),
    }));

    const authors = (authorsResult.data ?? []).map((auth) => ({
      ...auth,
      created_at: auth.created_at,
      updated_at: auth.updated_at,
    }));

    const subcategories = (subcategoriesResult.data ?? []).map((sub) => ({
      ...sub,
      created_at: new Date(sub.created_at),
      updated_at: new Date(sub.updated_at),
    }));

    const users = (usersResult.data ?? []) as User[];

    const tags = (tagsResult.data ?? []) as Tag[];

    // Serialize data for client component
    const serializedData = {
      categories: serializeForClient(categories),
      authors: serializeForClient(authors),
      subcategories: serializeForClient(subcategories),
      users: serializeForClient(users),
      tags: serializeForClient(tags),
    };

    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ArticleForm
          categories={serializedData.categories}
          authors={serializedData.authors}
          subcategories={serializedData.subcategories}
          users={serializedData.users}
          tags={serializedData.tags}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading form data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {error instanceof Error ? error.message : "An error occurred"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
