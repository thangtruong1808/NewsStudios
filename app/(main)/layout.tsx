import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";

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
    </div>
  );
}
