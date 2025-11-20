import { Metadata } from 'next';
import TagArticlesClient from './TagArticlesClient';
import { getTagById } from '@/app/lib/actions/tags';

// Component Info
// Description: Server component generating metadata and rendering tag articles page.
// Date updated: 2025-November-21
// Author: thangtruong

interface TagArticlesProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: TagArticlesProps): Promise<Metadata> {
  let title = 'Articles by Tag | NewsStudios';
  let description = 'Browse and discover a comprehensive collection of articles filtered by tags. Explore curated content, trending topics, and engaging multimedia articles from our extensive library organized by relevant tags and categories.';

  try {
    const result = await getTagById(parseInt(params.id));
    if (result.data) {
      const tag = result.data;
      title = `Articles tagged "${tag.name}" | NewsStudios`;
      description = `Discover a comprehensive collection of articles tagged with "${tag.name}". Browse through curated content, trending topics, and engaging multimedia articles from our extensive library. Find high-quality content and stay updated with the latest news and insights related to this topic.`;
    }
  } catch (_error) {
    // Silent: fallback metadata already set
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news-studios.vercel.app"),
    title,
    description,
    keywords: ['articles', 'tags', 'content', 'blog'],
    authors: [{ name: 'thang-truong' }],
    openGraph: {
      title,
      description,
      url: `https://news-studios.vercel.app/articles/tag/${params.id}`,
      type: 'website',
      siteName: 'NewsStudios',
      images: [
        {
          url: 'https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png',
          width: 400,
          height: 209,
          alt: 'NewsStudios Tagged Articles',
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

export default function TagArticles({ params }: TagArticlesProps) {
  return <TagArticlesClient params={params} />;
}