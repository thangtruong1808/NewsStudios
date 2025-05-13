import { getCategories } from "../../../../lib/actions/categories";
import { getAuthors } from "../../../../lib/actions/authors";
import { getSubcategories } from "../../../../lib/actions/subcategories";
import { getUsers } from "../../../../lib/actions/users";
import { getTags } from "../../../../lib/actions/tags";
import { getArticleById } from "../../../../lib/actions/articles";
import ArticleForm from "@/app/components/dashboard/articles/form/ArticleForm";
import { User, Tag } from "../../../../lib/definition";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  try {
    // Fetch all required data in parallel
    const [
      articleResult,
      categoriesResult,
      authorsResult,
      subcategoriesResult,
      usersResult,
      tagsResult,
    ] = await Promise.all([
      getArticleById(parseInt(params.id)),
      getCategories(),
      getAuthors(),
      getSubcategories(),
      getUsers(),
      getTags(),
    ]);

    // Check if article exists
    if (articleResult.error || !articleResult.data) {
      notFound();
    }

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

    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ArticleForm
          article={articleResult.data}
          categories={categories}
          authors={authors}
          subcategories={subcategories}
          users={users}
          tags={tags}
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
