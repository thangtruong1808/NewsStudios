import { Metadata } from 'next';
import EditSubcategoryPageClient from './EditSubcategoryPageClient';

export const metadata: Metadata = {
  title: 'Edit Subcategory | NewsStudios',
  description: 'Edit subcategory information and manage its content',
  keywords: ['subcategories', 'edit subcategory', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function EditSubcategoryPage() {
  return <EditSubcategoryPageClient />;
}
