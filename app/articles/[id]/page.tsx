import { Metadata } from 'next';
import ArticlePageClient from './ArticlePageClient';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  return {
    title: `Article | NewsStudios`,
    description: 'Read and explore our latest articles',
    keywords: ['articles', 'news', 'content', 'blog'],
    authors: [{ name: 'thang-truong' }],
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return <ArticlePageClient params={params} />;
}
