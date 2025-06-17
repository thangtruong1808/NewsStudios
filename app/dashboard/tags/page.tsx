import { Metadata } from 'next';
import TagsPageClient from './TagsPageClient';

export const metadata: Metadata = {
  title: 'Tags Management | NewsStudios',
  description: 'Manage and organize your tags for better content organization',
  keywords: ['tags', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function TagsPage() {
  return <TagsPageClient />;
}
