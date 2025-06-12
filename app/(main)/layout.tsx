import NavBar from "../components/front-end/navbar/NavBar";
import QuickLinks from "../components/front-end/QuickLinks";
import RightSidebar from "../components/front-end/RightSidebar";
import Footer from "../components/front-end/Footer";
import LatestArticles from "../components/front-end/LatestArticles";

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

      {/* Main content with sidebars */}
      <div className="flex-1">
        <div className="max-w-[1536px] mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <main className="flex-1 min-w-0 w-full lg:w-auto">{children}</main>

            {/* Right Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <QuickLinks />
              <RightSidebar />
            </div>
          </div>
          {/* LatestArticles Section */}
          <div className="rounded-lg shadow-sm">
            <div className="p-6">
              <LatestArticles />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with full width but centered content */}
      <div className="w-full bg-white border-t border-gray-200">
        <div className="max-w-[1536px] mx-auto px-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}
