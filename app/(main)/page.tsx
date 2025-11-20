import { ArticlesTrending } from "@/app/components/front-end/trending-articles/ArticlesTrending";
import HighlightArticles from "../components/front-end/highlight-articles/HighlightArticles";
import FeaturedArticles from "@/app/components/front-end/FeaturedArticles/FeaturedArticles";
import RelativeArticles from "@/app/components/front-end/relative-articles/RelativeArticles";
import Tags from "../components/front-end/Tags/Tags";
import VideoCarousel from "../components/front-end/VideoCarousel";
import ProjectHeader from "../components/front-end/ProjectHeader";
import ScrollButtons from "../components/front-end/shared/ScrollButtons";

// Component Info
// Description: Home page layout orchestrating project header, video carousel, featured articles, highlights, trending, related articles, and tags sections.
// Date updated: 2025-November-21
// Author: thangtruong

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Project Header Section - Welcome banner */}
      <section className="">
        <ProjectHeader />
      </section>

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

      {/* Scroll buttons */}
      <ScrollButtons />
    </main>
  );
}
