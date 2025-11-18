import { Metadata } from 'next';
import ArticlePageClient from './ArticlePageClient';
import { getArticleById } from '@/app/lib/actions/articles';

// Component Info
// Description: Server component generating metadata and rendering article detail page.
// Date created: 2025-11-18
// Author: thangtruong

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  let title = 'Article | NewsStudios';
  let description = 'Read and explore our latest articles with comprehensive coverage of trending topics, breaking news, and in-depth analysis. Discover engaging content from our extensive library of high-quality articles and multimedia content.';

  try {
    const result = await getArticleById(parseInt(params.id));
    if (result.data) {
      const article = result.data;
      title = `${article.title} | NewsStudios`;

      // Create a description from the article content, ensuring it's at least 100 characters
      const contentPreview = article.content
        ? article.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'
        : 'Read this comprehensive article with detailed insights and analysis.';

      description = `${contentPreview} Explore more articles in ${article.category_name || 'our content library'} and stay updated with the latest news and insights.`;
    }
  } catch (_error) {
    // Silent: fallback metadata already set
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news-studios.vercel.app"),
    title,
    description,
    keywords: ['articles', 'news', 'content', 'blog'],
    authors: [{ name: 'thang-truong' }],
    openGraph: {
      title,
      description,
      url: `https://news-studios.vercel.app/articles/${params.id}`,
      type: 'article',
      siteName: 'NewsStudios',
      images: [
        {
          url: 'https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png',
          width: 400,
          height: 209,
          alt: 'NewsStudios Article',
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

export default function ArticlePage({ params }: ArticlePageProps) {
  return <ArticlePageClient params={params} />;
}
