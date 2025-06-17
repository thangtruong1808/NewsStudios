import { Metadata } from 'next';
import ExploreLayoutClient from './ExploreLayoutClient';

export const metadata: Metadata = {
  title: 'Explore | NewsStudios',
  description: 'Discover and explore content across different categories and tags',
  keywords: ['explore', 'content', 'categories', 'tags', 'articles', 'videos'],
  authors: [{ name: 'thang-truong' }],
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ExploreLayoutClient>{children}</ExploreLayoutClient>;
}
