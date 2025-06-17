import { Metadata } from 'next';
import PhotosPageClient from './PhotosPageClient';

export const metadata: Metadata = {
  title: 'Photos Management | NewsStudios',
  description: 'Manage and organize your photos, media content, and gallery in one place',
  keywords: ['photos', 'media management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function PhotosPage() {
  return <PhotosPageClient />;
}
