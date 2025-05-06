import NavBar from "./components/front-end/NavBar";
import Button from "./components/Button";
import Advertisements from "./components/front-end/Advertisements";
import Sponsors from "./components/front-end/Sponsors";
import LeftSidebar from "./components/front-end/LeftSidebar";
import RightSidebar from "./components/front-end/RightSidebar";
import Footer from "./components/front-end/Footer";
import Articles from "./components/front-end/Articles";
import LatestArticles from "./components/front-end/LatestArticles";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NavBar with full width but centered content */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1536px] mx-auto px-4">
          <NavBar />
        </div>
      </div>

      {/* Main content with sidebars */}
      <div className="flex-1">
        <div className="max-w-[1536px] mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Left Sidebar */}
            {/* <div className="w-64 flex-shrink-0">
              <LeftSidebar />
            </div> */}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Get LaestArticle */}
              <div className="">
                <LatestArticles />
              </div>
              {/**/}
              {/* Articles Section */}
              <div className="mb-12 bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <Articles />
                </div>
              </div>

              {/* Advertisements Section */}
              <div className="mb-12 bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Featured Advertisements
                  </h2>
                  <Advertisements />
                </div>
              </div>

              {/* Sponsors Section */}
              <div className="mb-12 bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <Sponsors />
                </div>
              </div>
            </main>

            {/* Right Sidebar */}
            <div className="w-72 flex-shrink-0">
              <RightSidebar />
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
