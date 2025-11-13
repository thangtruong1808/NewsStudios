import { Metadata } from 'next';
import AuthorsPageClient from './AuthorsPageClient';

export const metadata: Metadata = {
  title: 'Authors Management | NewsStudios',
  description: 'Manage and organize your authors, content creators, and contributors in one place',
  keywords: ['authors', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

// Description: Authors dashboard page wrapper exposing the client component.
// Data created: 2024-11-13
// Author: thangtruong
export default function AuthorsPage() {
  return <AuthorsPageClient />;
}
