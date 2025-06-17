import { Metadata } from 'next';
import ExplorePageClient from './ExplorePageClient';

export const metadata: Metadata = {
  title: 'Explore Content | NewsStudios',
  description: 'Browse and discover content across different categories and tags',
  keywords: ['explore', 'content', 'categories', 'tags', 'articles', 'videos'],
  authors: [{ name: 'thang-truong' }],
};

export default function ExplorePage() {
  return <ExplorePageClient />;
}
