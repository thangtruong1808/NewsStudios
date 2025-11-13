import { ClockIcon } from "@heroicons/react/24/outline";

interface ArticleHeaderProps {
  title: string;
}

// Description: Styled header banner for latest article section with gradient background.
// Data created: 2024-11-13
// Author: thangtruong
export const ArticleHeader = ({ title }: ArticleHeaderProps) => (
  <div className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 shadow-lg">
    {/* Decorative elements */}
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
    <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10"></div>
    <div className="absolute -left-3 -bottom-3 h-20 w-20 rounded-full bg-white/10"></div>

    {/* Content */}
    <div className="relative z-10 w-full">
      {/* Latest badge */}
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
        <ClockIcon className="h-4 w-4 text-white" />
        <span className="text-xs font-medium text-white">
          The Latest Article
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white md:text-3xl w-full">
        {title}
      </h1>

      {/* Decorative line */}
      <div className="mt-2 h-0.5 w-16 rounded-full bg-white/30"></div>
    </div>
  </div>
);
