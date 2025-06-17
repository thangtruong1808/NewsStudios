import { Metadata } from 'next';
import CreateSubcategoryPageClient from './CreateSubcategoryPageClient';

export const metadata: Metadata = {
  title: 'Create Subcategory | NewsStudios',
  description: 'Create a new subcategory for better content organization',
  keywords: ['subcategories', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function CreateSubcategoryPage() {
  return <CreateSubcategoryPageClient />;
}
