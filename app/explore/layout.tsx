import type { Metadata } from "next";
import { getCategoryById } from "@/app/lib/actions/categories";
import { getSubcategoryById } from "@/app/lib/actions/subcategories";
import ExploreLayout from "@/app/components/front-end/explore/ExploreLayout";

export async function generateMetadata({ searchParams }: { searchParams: { categoryId?: string; subcategoryId?: string } }): Promise<Metadata> {
  const categoryId = searchParams?.categoryId;
  const subcategoryId = searchParams?.subcategoryId;

  if (subcategoryId) {
    const subcategoryResult = await getSubcategoryById(parseInt(subcategoryId));
    if (subcategoryResult.data) {
      const categoryResult = await getCategoryById(subcategoryResult.data.category_id);
      const subcategory = subcategoryResult.data;
      const category = categoryResult.data;

      if (category) {
        return {
          title: `${subcategory.name} - ${category.name} | NewsStudios`,
          description: `Explore ${subcategory.name} articles and news in ${category.name} on NewsStudios. Stay updated with the latest ${subcategory.name.toLowerCase()} content, tutorials, and insights.`,
          keywords: `${subcategory.name}, ${category.name}, news, articles, ${subcategory.name.toLowerCase()} content, latest updates`,
          authors: [{
            name: "Thang Truong"
          }],
          openGraph: {
            title: `${subcategory.name} - ${category.name} | NewsStudios`,
            description: `Explore ${subcategory.name} articles and news in ${category.name} on NewsStudios. Stay updated with the latest ${subcategory.name.toLowerCase()} content, tutorials, and insights.`,
            type: "website",
            locale: "en_US",
            siteName: "NewsStudios"
          }
        };
      }
    }
  }

  if (categoryId) {
    const result = await getCategoryById(parseInt(categoryId));
    if (result.data) {
      const category = result.data;
      return {
        title: `${category.name} | NewsStudios`,
        description: `Explore ${category.name} articles and news on NewsStudios. Stay updated with the latest ${category.name.toLowerCase()} content, stories, and insights.`,
        keywords: `${category.name}, news, articles, ${category.name.toLowerCase()} content, latest updates`,
        authors: [{
          name: "Thang Truong"
        }],
        openGraph: {
          title: `${category.name} | NewsStudios`,
          description: `Explore ${category.name} articles and news on NewsStudios. Stay updated with the latest ${category.name.toLowerCase()} content, stories, and insights.`,
          type: "website",
          locale: "en_US",
          siteName: "NewsStudios"
        }
      };
    }
  }

  return {
    title: "Explore | NewsStudios",
    description: "Explore articles and news across various categories on NewsStudios. Find the latest content, stories, and insights.",
    keywords: "explore, news, articles, categories, latest updates",
    authors: [{
      name: "Thang Truong"
    }],
    openGraph: {
      title: "Explore | NewsStudios",
      description: "Explore articles and news across various categories on NewsStudios. Find the latest content, stories, and insights.",
      type: "website",
      locale: "en_US",
      siteName: "NewsStudios"
    }
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExploreLayout>{children}</ExploreLayout>;
}
