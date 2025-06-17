import { Metadata } from 'next';
import EditAuthorPageClient from './EditAuthorPageClient';

export const metadata: Metadata = {
  title: 'Edit Author | NewsStudios',
  description: 'Edit author profile and manage their content contributions',
  keywords: ['authors', 'edit author', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

interface EditAuthorPageProps {
  params: {
    id: string;
  };
}

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
  return <EditAuthorPageClient params={params} />;
}
