import Button from "../components/Button";
import Advertisements from "../components/front-end/Advertisements";
import LatestArticles from "../components/front-end/LatestArticles";
import LatestSingleArticle from "../components/front-end/LatestSingleArticle";
import ArticlesTrending from "../components/front-end/ArticlesTrending";

export default function Home() {
  return (
    <>
      {/* Get LatestArticle */}
      <div>
        <LatestSingleArticle />
      </div>

      {/* Trending Articles Section */}
      <div className="mt-12">
        <ArticlesTrending />
      </div>

      {/* LatestArticles Section
      <div className="rounded-lg shadow-sm">
        <div className="p-6">
          <LatestArticles />
        </div>
      </div> */}

      {/* Advertisements Section */}
      {/* <div className="mb-12 bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Advertisements
          </h2>
          <Advertisements />
        </div>
      </div> */}

      {/* Sponsors Section */}
      {/* <div className="mb-12 bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <Sponsors />
        </div>
      </div> */}
    </>
  );
}
