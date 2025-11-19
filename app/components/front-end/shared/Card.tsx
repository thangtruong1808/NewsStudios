// Component Info
// Description: Reusable card component for displaying article previews with image, metadata, and interactions.
// Date created: 2025-01-27
// Author: thangtruong

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserIcon,
  CalendarIcon,
  TagIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

// Props interface for the Card component
interface CardProps {
  title: string; // Article title
  description?: string; // Optional article description
  imageUrl?: string; // Optional article image URL
  link: string; // Article link/URL
  date?: string; // Publication date
  author?: string; // Author name
  category?: string; // Article category
  subcategory?: string; // Article subcategory
  tags?: string[]; // Article tags
  tagColors?: string[]; // Colors for tags
  likesCount?: number; // Number of likes
  commentsCount?: number; // Number of comments
  children?: React.ReactNode; // Optional children components
  onLikeClick?: () => void; // Like click handler
  onCommentClick?: () => void; // Comment click handler
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  link,
  date,
  author,
  category,
  subcategory,
  tags,
  tagColors,
  likesCount,
  commentsCount,
  children,
  onLikeClick,
  onCommentClick,
}) => {
  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return ""; // Return empty string if date is not provided

    try {
      // Handle ISO date string
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return ""; // Return empty string if date is invalid
      }

      // Format the date
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC", // Ensure consistent date display
      };

      return date.toLocaleDateString("en-US", options);
    } catch (_error) {
      return ""; // Return empty string if parsing fails
    }
  };

  // Handle like click
  const handleLikeClick = () => {
    onLikeClick?.();
  };

  // Handle comment click
  const handleCommentClick = () => {
    onCommentClick?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
      {/* Article image section */}
      <div className="relative w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200">
        {children ? (
          children
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          // Placeholder when no image or video - friendly message
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
            <PhotoIcon className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 font-medium text-center px-2">Image coming soon</span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-grow">
        {/* Category and subcategory badges */}
        {(category || subcategory) && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {category && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-gray-500">
                  Category:
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 rounded">
                  {category}
                </span>
              </div>
            )}
            {subcategory && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-gray-500">
                  Sub:
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 rounded">
                  {subcategory}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Article title and description */}
        <h3 className="text-base font-semibold mb-1.5 line-clamp-2">
          <Link href={link} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h3>
        {description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Article metrics (likes, comments) and date */}
        {(likesCount !== undefined ||
          commentsCount !== undefined ||
          date) && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-gray-500">
              {likesCount !== undefined && (
                <button
                  onClick={handleLikeClick}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  aria-label="Like article"
                  disabled
                >
                  <HandThumbUpIcon className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{likesCount}</span>
                </button>
              )}
              {commentsCount !== undefined && (
                <button
                  onClick={handleCommentClick}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  aria-label="View comments"
                  disabled
                >
                  <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{commentsCount}</span>
                </button>
              )}
            </div>
            {date && (
              <div className="flex items-center gap-1 text-gray-500">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="text-[10px]">{formatDate(date)}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags and author section */}
        {((tags && tags.length > 0) || author) && (
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1">
              {tags && tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <TagIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[10px] font-medium text-gray-500">
                    Tags:
                  </span>
                </div>
              )}
              {author && (
                <div className="flex items-center gap-1 text-gray-500">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="text-[10px] line-clamp-1">{author}</span>
                </div>
              )}
            </div>
            {/* Tag badges */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 text-[10px] font-medium text-white rounded"
                    style={{
                      backgroundColor: tagColors?.[index],
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
