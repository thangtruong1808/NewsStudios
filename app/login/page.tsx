import { Metadata } from 'next';
import LoginPageClient from './LoginPageClient';

export const metadata: Metadata = {
  title: 'Login | NewsStudios',
  description: 'Sign in to access your NewsStudios dashboard',
  keywords: ['login', 'authentication', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function LoginPage() {
  return <LoginPageClient />;
}
