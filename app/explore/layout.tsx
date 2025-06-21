import { Metadata } from 'next';
import ExploreLayoutClient from './ExploreLayoutClient';

export const metadata: Metadata = {
  title: 'Explore | NewsStudios',
  description: 'Discover and explore a comprehensive collection of articles, videos, and multimedia content across diverse categories and tags. Browse through curated content from various topics and find exactly what you\'re looking for.',
  keywords: ['explore', 'content', 'categories', 'tags', 'articles', 'videos'],
  authors: [{ name: 'thang-truong' }],
  openGraph: {
    title: 'Explore | NewsStudios',
    description: 'Discover and explore a comprehensive collection of articles, videos, and multimedia content across diverse categories and tags. Browse through curated content from various topics and find exactly what you\'re looking for.',
    url: 'https://news-studios.vercel.app/explore',
    type: 'website',
    siteName: 'NewsStudios',
    images: [
      {
        url: 'https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png',
        width: 400,
        height: 209,
        alt: 'NewsStudios Explore Platform',
      },
    ],
  },
  other: {
    'fb:app_id': '692383700367966',
    'author': 'thang-truong',
    'article:author': 'thang-truong',
    'published_time': new Date().toISOString(),
    'article:published_time': new Date().toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore | NewsStudios',
    description: 'Discover and explore a comprehensive collection of articles, videos, and multimedia content across diverse categories and tags. Browse through curated content from various topics and find exactly what you\'re looking for.',
    images: ['https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png'],
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExploreLayoutClient>{children}</ExploreLayoutClient>;
}
