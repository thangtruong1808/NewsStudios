import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface ExpandableTagListProps {
  tags: string[];
  tagColors: string[];
}

export default function ExpandableTagList({
  tags,
  tagColors,
}: ExpandableTagListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tagsPerRow = 2;
  const maxRows = 3;
  const maxVisibleTags = tagsPerRow * maxRows;

  const visibleTags = isExpanded ? tags : tags.slice(0, maxVisibleTags);
  const hasMoreTags = tags.length > maxVisibleTags;

  // Function to determine text color based on background color
  const getTextColor = (bgColor: string) => {
    // Remove any whitespace and convert to lowercase
    const color = bgColor.trim().toLowerCase();

    // If the color is a hex code, convert it to RGB
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Return black for light colors and white for dark colors
      return luminance > 0.5 ? "#000000" : "#ffffff";
    }

    // Default to black for named colors or invalid colors
    return "#000000";
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-1">
        {visibleTags.map((tag, index) => {
          const bgColor = tagColors[index] || "#e0e0e0";
          const textColor = getTextColor(bgColor);

          return (
            <span
              key={index}
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: bgColor,
                color: textColor,
              }}
            >
              {tag}
            </span>
          );
        })}
      </div>
      {hasMoreTags && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start inline-flex items-center gap-1 rounded border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors duration-200 mt-2"
        >
          {isExpanded ? (
            <>
              Show Less
              <ChevronUpIcon className="h-3 w-3" />
            </>
          ) : (
            <>
              Show More
              <ChevronDownIcon className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
