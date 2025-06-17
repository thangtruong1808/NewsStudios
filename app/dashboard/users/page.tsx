import { Metadata } from 'next';
import UsersPageClient from './UsersPageClient';

export const metadata: Metadata = {
  title: 'Users Management | NewsStudios',
  description: 'Manage and organize your users, roles, and permissions in one place',
  keywords: ['users', 'user management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function UsersPage() {
  return <UsersPageClient />;
}
