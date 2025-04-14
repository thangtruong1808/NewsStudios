import { getCategories } from "../../../lib/actions/categories";
import { getAuthors } from "../../../lib/actions/authors";
import { getSubcategories } from "../../../lib/actions/subcategories";
import { getUsers } from "../../../lib/actions/users";
import ArticleForm from "../../../components/dashboard/articles/ArticleForm";
import { User } from "../../../lib/definition";

export default async function CreateArticlePage() {
  try {
    const [categoriesResult, authorsResult, subcategoriesResult, usersResult] =
      await Promise.all([
        getCategories(),
        getAuthors(),
        getSubcategories(),
        getUsers(),
      ]);

    // Extract data and ensure it's an array with proper type checking
    const categories = (categoriesResult.data ?? []) as {
      id: number;
      name: string;
      description?: string;
    }[];
    const authors = (authorsResult.data ?? []) as {
      id: number;
      name: string;
    }[];
    const subcategories = (subcategoriesResult.data ?? []) as {
      id: number;
      name: string;
      category_id: number;
      description?: string;
    }[];
    const users = (usersResult.data ?? []) as User[];

    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">Create New Article</h1>
        <ArticleForm
          categories={categories}
          authors={authors}
          subcategories={subcategories}
          users={users}
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
