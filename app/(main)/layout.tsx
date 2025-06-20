import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";
import TopButton from "../components/front-end/shared/TopButton";
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://news-studios.vercel.app'),
  title: 'Home | NewsStudios',
  description: 'Discover and explore a comprehensive collection of articles, videos, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights from our extensive library.',
  keywords: ['dashboard', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
  openGraph: {
    title: 'Home | NewsStudios',
    description: 'Discover and explore a comprehensive collection of articles, videos, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights from our extensive library.',
    url: 'https://news-studios.vercel.app',
    type: 'website',
    siteName: 'NewsStudios',
    images: [
      {
        url: 'https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png',
        width: 400,
        height: 209,
        alt: 'NewsStudios Platform',
      },
    ],
  },
  other: {
    'appId': '692383700367966',
    'article:author': 'thang-truong',
    'article:published_time': new Date().toISOString(),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home | NewsStudios',
    description: 'Discover and explore a comprehensive collection of articles, videos, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights from our extensive library.',
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
