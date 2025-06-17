import { Metadata } from 'next';
import TagArticlesClient from './TagArticlesClient';

interface TagArticlesProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: TagArticlesProps): Promise<Metadata> {
  return {
    title: `Articles by Tag | NewsStudios`,
    description: 'Browse articles filtered by tag',
    keywords: ['articles', 'tags', 'content', 'blog'],
    authors: [{ name: 'thang-truong' }],
  };
}

export default function TagArticles({ params }: TagArticlesProps) {
  return <TagArticlesClient params={params} />;
}