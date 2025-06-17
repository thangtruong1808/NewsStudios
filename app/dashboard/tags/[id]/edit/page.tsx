import { Metadata } from 'next';
import EditTagPageClient from './EditTagPageClient';

export const metadata: Metadata = {
  title: 'Edit Tag | NewsStudios',
  description: 'Edit and manage your tag details',
  keywords: ['tags', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function EditTagPage() {
  return <EditTagPageClient />;
}
