import type { Metadata } from "next";
import { getTagById } from "@/app/lib/actions/tags";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const tagResult = await getTagById(Number(params.id));
  if (tagResult.data) {
    const tag = tagResult.data;
    return {
      title: `${tag.name} Articles | NewsStudios`,
      description: tag.description || `Browse articles tagged with ${tag.name} on NewsStudios.`,
      keywords: `${tag.name}, articles, news, tag`,
      authors: [{ name: "Thang Truong" }],
      openGraph: {
        title: `${tag.name} Articles | NewsStudios`,
        description: tag.description || `Browse articles tagged with ${tag.name} on NewsStudios.`,
        type: "website",
        locale: "en_US",
        siteName: "NewsStudios",
      }
    };
  }
  return {
    title: "Tag Articles | NewsStudios",
    description: "Browse articles by tag on NewsStudios.",
    authors: [{ name: "Thang Truong" }]
  };
}

export default function TagArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 