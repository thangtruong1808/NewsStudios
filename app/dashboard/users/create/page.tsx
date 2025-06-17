import { Metadata } from 'next';
import UserForm from "../../../components/dashboard/users/form/UserForm";

export const metadata: Metadata = {
  title: 'Create User | NewsStudios',
  description: 'Create a new user, role, and permission in one place',
  keywords: ['users', 'user management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function CreateUserPage() {
  return (
    <div className="bg-gray-50">
      <UserForm isEditMode={false} />
    </div>
  );
}
