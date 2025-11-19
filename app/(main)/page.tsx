import { ArticlesTrending } from "@/app/components/front-end/trending-articles/ArticlesTrending";
import HighlightArticles from "../components/front-end/highlight-articles/HighlightArticles";
import FeaturedArticles from "@/app/components/front-end/FeaturedArticles/FeaturedArticles";
import RelativeArticles from "@/app/components/front-end/relative-articles/RelativeArticles";
import Tags from "../components/front-end/Tags/Tags";
import VideoCarousel from "../components/front-end/VideoCarousel";

// Component Info
// Description: Home page layout orchestrating video carousel, featured articles, highlights, trending, related articles, and tags sections.
// Date created: 2025-01-27
// Author: thangtruong

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Video Carousel Section - Hero section */}
      <section className="mb-16 md:mb-20">
        <VideoCarousel />
      </section>

      {/* Featured Articles Section */}
      <section id="featured-articles" className="mb-16 md:mb-20">
        <FeaturedArticles />
      </section>

      {/* Highlight Articles Section */}
      <section id="highlight-articles" className="mb-16 md:mb-20">
        <HighlightArticles />
      </section>

      {/* Trending Articles Section */}
      <section id="trending-articles" className="mb-16 md:mb-20">
        <ArticlesTrending />
      </section>

      {/* Related Articles Section */}
      <section id="related-articles" className="mb-16 md:mb-20">
        <RelativeArticles />
      </section>

      {/* Tags Section */}
      <section className="mb-16 md:mb-20">
        <Tags />
      </section>
    </main>
  );
}
