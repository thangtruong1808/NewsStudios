// Component Info
// Description: Hero header component displaying project showcase information and portfolio description for Next.js demonstration
// Date updated: 2025-November-21
// Author: thangtruong

/**
 * ProjectHeader Component
 * Displays a welcoming banner with project description to enhance user experience
 */
export default function ProjectHeader() {
  return (
    <div className="w-screen  relative left-1/2 right-1/2 -mx-[50vw] mb-8">
      <div className="max-w-[1536px] mx-auto px-6">
        {/* Header content section */}
        <div className="py-10 md:py-12">
          {/* Title section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome to NewsStudios
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-6"></div>
          </div>

          {/* Description section */}
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center mb-4">
              This is a portfolio project showcasing my skills in Next.js development, featuring a modern news platform with dynamic content management,
              interactive video carousels, article categorization, and responsive design. Built with Next.js 14, TypeScript, and Tailwind CSS.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed text-center mb-4">
              <strong>Interactive Features:</strong> Users can like and comment on any articles they wish to engage with. The platform includes advanced search functionality,
              user authentication, real-time engagement tracking, article sharing capabilities, and a comprehensive admin dashboard for content management.
              Explore features like category filtering, tag-based navigation, pagination, image galleries, and smooth scroll navigation.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed text-center">
              <strong>Note:</strong> All videos, images, and article content displayed on this platform are for demonstration purposes only
              and are not real news content. This project serves as a technical showcase of web development capabilities and modern frontend architecture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

