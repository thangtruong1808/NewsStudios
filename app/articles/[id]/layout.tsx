import type { Metadata } from "next";
import { getArticleById } from "@/app/lib/actions/articles";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const articleResult = await getArticleById(parseInt(params.id));

  if (articleResult.data) {
    const article = articleResult.data;
    return {
      title: `${article.title} | NewsStudios`,
      description: article.description || `Read the latest article about ${article.title} on NewsStudios.`,
      keywords: `${article.title}, ${article.category_name}, ${article.subcategory_name}, news, article`,
      authors: [{
        name: "Thang Truong"
      }],
      openGraph: {
        title: `${article.title} | NewsStudios`,
        description: article.description || `Read the latest article about ${article.title} on NewsStudios.`,
        type: "article",
        locale: "en_US",
        siteName: "NewsStudios",
        publishedTime: article.published_at.toISOString(),
        modifiedTime: article.updated_at.toISOString(),
        authors: ["Thang Truong"]
      }
    };
  }

  return {
    title: "Article Not Found | NewsStudios",
    description: "The requested article could not be found.",
    authors: [{
      name: "Thang Truong"
    }]
  };
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 