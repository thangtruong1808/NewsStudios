import { Metadata } from 'next';
import ExplorePageClient from './ExplorePageClient';
import { getSubcategoryById } from '@/app/lib/actions/subcategories';
import { getCategoryById } from '@/app/lib/actions/categories';

interface ExplorePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
  const subcategory = searchParams.subcategoryId as string;
  const categoryId = searchParams.categoryId as string;

  let title = 'Explore Content | NewsStudios';
  let description = 'Browse and discover a comprehensive collection of articles, videos, and multimedia content across diverse categories and tags. Find curated content from various topics and explore our extensive library of engaging media.';

  if (subcategory) {
    const subcategoryResult = await getSubcategoryById(parseInt(subcategory));
    if (subcategoryResult.data) {
      const categoryResult = await getCategoryById(subcategoryResult.data.category_id);
      const categoryName = categoryResult.data?.name || 'Unknown Category';
      title = `${subcategoryResult.data.name} Articles | NewsStudios`;
      description = `Explore a comprehensive collection of articles in the ${subcategoryResult.data.name} subcategory under ${categoryName}. Discover curated content, trending topics, and engaging multimedia articles from our extensive library. Browse through high-quality content and stay updated with the latest news and insights.`;
    }
  } else if (categoryId) {
    const categoryResult = await getCategoryById(parseInt(categoryId));
    if (categoryResult.data) {
      title = `${categoryResult.data.name} Articles | NewsStudios`;
      description = `Discover a comprehensive collection of articles in the ${categoryResult.data.name} category. Browse through curated content, trending topics, and engaging multimedia articles from our extensive library. Find high-quality content and stay updated with the latest news and insights across various subcategories.`;
    }
  }

  return {
    title,
    description,
    keywords: ['explore', 'content', 'categories', 'tags', 'articles', 'videos'],
    authors: [{ name: 'thang-truong' }],
    openGraph: {
      title,
      description,
      url: 'https://news-studios.vercel.app/explore',
      type: 'website',
      siteName: 'NewsStudios',
      images: [
        {
          url: 'https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png',
          width: 400,
          height: 209,
          alt: 'NewsStudios Explore Content Platform',
        },
      ],
    },
    other: {
      'fb:app_id': 'your-facebook-app-id',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png'],
    },
  };
}

export default function ExplorePage() {
  return <ExplorePageClient />;
}
