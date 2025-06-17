import { Metadata } from 'next';
import CreateAuthorPageClient from './CreateAuthorPageClient';

export const metadata: Metadata = {
  title: 'Create Author | NewsStudios',
  description: 'Create a new author profile and manage their content contributions',
  keywords: ['authors', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function CreateAuthorPage() {
  return <CreateAuthorPageClient />;
}
