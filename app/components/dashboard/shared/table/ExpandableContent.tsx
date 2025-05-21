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
  maxWords = 10,
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
        <span className="text-xs  break-words whitespace-normal text-left">
          {displayContent}
        </span>
        {shouldShowButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start inline-flex items-center gap-1 rounded border border-zinc-400 px-2 py-1 text-xxs font-medium hover:bg-blue-100 transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                <span className="">Show Less</span>
                <ChevronUpIcon className="h-3 w-3" />
              </>
            ) : (
              <>
                <span className="">Show More</span>
                <ChevronDownIcon className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
