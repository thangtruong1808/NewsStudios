import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";
import TopButton from "../components/front-end/shared/TopButton";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | NewsStudios',
  description: 'Manage your content, articles, and media in one place',
  keywords: ['dashboard', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
  openGraph: {
    title: 'Home | NewsStudios',
    description: 'Manage your content, articles, and media in one place',
    images: [
      {
        url: 'https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png',
        width: 600,
        height: 315,
        alt: 'NewsStudios Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home | NewsStudios',
    description: 'Manage your content, articles, and media in one place',
    images: ['https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png'],
  },
};
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NavBar with full width but centered content */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-[1536px] mx-auto px-6">
          <NavBar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="max-w-[1536px] mx-auto px-4 py-8">
          {/* Main Content */}
          <main className="w-full">{children}</main>
        </div>
      </div>

      {/* Footer with full width but centered content */}
      <div className="w-full bg-white border-t border-gray-200">
        <div className="max-w-[1536px] mx-auto px-4">
          <Footer />
        </div>
      </div>

      {/* Top Button */}
      <TopButton />
    </div>
  );
}
