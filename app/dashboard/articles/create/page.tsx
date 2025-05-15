import { getCategories } from "@/app/lib/actions/categories";
import { getAuthors } from "@/app/lib/actions/authors";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import { getUsers } from "@/app/lib/actions/users";
import { getTags } from "@/app/lib/actions/tags";
import ArticleFormContainer from "@/app/components/dashboard/articles/form/ArticleFormContainer";

export default async function CreateArticlePage() {
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

  if (categoriesResult.error) {
    throw new Error(categoriesResult.error);
  }

  if (authorsResult.error) {
    throw new Error(authorsResult.error);
  }

  if (subcategoriesResult.error) {
    throw new Error(subcategoriesResult.error);
  }

  if (usersResult.error) {
    throw new Error(usersResult.error);
  }

  if (tagsResult.error) {
    throw new Error(tagsResult.error);
  }

  return (
    <ArticleFormContainer
      categories={categoriesResult.data || []}
      authors={authorsResult.data || []}
      subcategories={subcategoriesResult.data || []}
      users={usersResult.data || []}
      tags={tagsResult.data || []}
    />
  );
}
