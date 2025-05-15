import { getArticleById } from "@/app/lib/actions/articles";
import { getCategories } from "@/app/lib/actions/categories";
import { getAuthors } from "@/app/lib/actions/authors";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import { getUsers } from "@/app/lib/actions/users";
import { getTags } from "@/app/lib/actions/tags";
import ArticleFormContainer from "@/app/components/dashboard/articles/form/ArticleFormContainer";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
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

  if (articleResult.error || !articleResult.data) {
    notFound();
  }

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
      article={articleResult.data}
      categories={categoriesResult.data || []}
      authors={authorsResult.data || []}
      subcategories={subcategoriesResult.data || []}
      users={usersResult.data || []}
      tags={tagsResult.data || []}
    />
  );
}
