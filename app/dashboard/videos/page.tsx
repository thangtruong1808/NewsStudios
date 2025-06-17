import { Metadata } from 'next';
import VideosPageClient from '@/app/dashboard/videos/VideosPageClient';

export const metadata: Metadata = {
  title: 'Videos Management | NewsStudios',
  description: 'Manage and organize your videos, media content, and gallery in one place',
  keywords: ['videos', 'media management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function VideosPage() {
  return <VideosPageClient />;
}
