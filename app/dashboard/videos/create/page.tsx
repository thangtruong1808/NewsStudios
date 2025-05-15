import { getArticles } from "@/app/lib/actions/articles";
import CreateVideoPageClient from "@/app/components/dashboard/videos/CreateVideoPageClient";

export default async function CreateVideoPage() {
  const articlesResult = await getArticles();

  if (articlesResult.error) {
    throw new Error(articlesResult.error);
  }

  return <CreateVideoPageClient articles={articlesResult.data || []} />;
}
