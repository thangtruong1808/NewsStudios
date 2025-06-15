import Button from "../components/Button";
import { ArticlesTrending } from "@/app/components/front-end/trending-articles/ArticlesTrending";
import HighlightArticles from "../components/front-end/highlight-articles/HighlightArticles";
import { QuickLinks } from "@/app/components/front-end/quick-links/QuickLinks";
import FeaturedArticles from "@/app/components/front-end/FeaturedArticles/FeaturedArticles";
import RelativeArticles from "@/app/components/front-end/relative-articles/RelativeArticles";
import Tags from "../components/front-end/Tags/Tags";
import TopButton from "@/app/components/front-end/shared/TopButton";

export default function Home() {
  return (
    <>
      {/* Quick Links Section */}
      <div className="mb-12">
        <QuickLinks />
      </div>
      {/* Featured Articles Section */}
      <div id="featured-articles" className="m-12">
        <FeaturedArticles />
      </div>
      {/* <div>
        <hr className="my-12 bg-gray-200 py-8 relative left-1/2 right-1/2 -mx-[50vw]" />
      </div> */}
      {/* Highlight Articles Section */}
      <div id="highlight-articles" className="m-12">
        <HighlightArticles />
      </div>

      {/* Trending Articles Section */}
      <div id="trending-articles" className="m-12">
        <ArticlesTrending />
      </div>

      {/* Related Articles Section */}
      <div id="related-articles" className="m-12">
        <RelativeArticles />
      </div>

      {/* Tags Section */}
      <div className="m-12">
        <Tags />
      </div>

      {/* Top Button */}
      {/* <TopButton /> */}
    </>
  );
}
