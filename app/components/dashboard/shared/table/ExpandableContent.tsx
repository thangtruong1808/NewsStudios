"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface ExpandableContentProps {
  content: string;
  maxWords?: number;
  className?: string;
}

export default function ExpandableContent({
  content,
  maxWords = 20,
  className = "",
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = content.split(/\s+/);
  const shouldShowButton = words.length > maxWords;
  const displayContent = isExpanded
    ? content
    : words.slice(0, maxWords).join(" ") + (shouldShowButton ? "..." : "");

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-zinc-500 break-words whitespace-normal text-left">
          {displayContent}
        </span>
        {shouldShowButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start inline-flex items-center gap-1 rounded border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors duration-200"
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
    </div>
  );
}
