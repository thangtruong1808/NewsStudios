import { Metadata } from 'next';
import EditUserPageClient from './EditUserPageClient';

export const metadata: Metadata = {
  title: 'Edit User | NewsStudios',
  description: 'Edit user information, roles, and permissions',
  keywords: ['user management', 'edit user', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function EditUserPage() {
  return <EditUserPageClient />;
}
