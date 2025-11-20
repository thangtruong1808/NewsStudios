"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

// Component Info
// Description: Scroll to top and bottom button component that displays one button at a time based on scroll position.
// Date updated: 2025-November-21
// Author: thangtruong

export default function ScrollButtons() {
  const [showButton, setShowButton] = useState<"top" | "bottom" | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  // Check if page has scrollable content
  const checkHasScroll = () => {
    const height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const hasVerticalScroll = height > window.innerHeight;
    setHasScroll(hasVerticalScroll);
    return hasVerticalScroll;
  };

  // Check scroll position and update button visibility
  const handleScroll = useCallback(() => {
    if (!checkHasScroll()) {
      setShowButton(null);
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollBottom = scrollTop + windowHeight;
    const isAtTop = scrollTop < 100;
    const isAtBottom = scrollBottom >= documentHeight - 100;

    // Show bottom button when at top, top button when scrolled down
    if (isAtTop && !isAtBottom) {
      setShowButton("bottom");
    } else if (!isAtTop) {
      setShowButton("top");
    } else {
      setShowButton(null);
    }
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll to bottom smoothly
  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    // Initial check
    checkHasScroll();
    handleScroll();

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    window.addEventListener("load", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("load", handleScroll);
    };
  }, [handleScroll]);

  // Don't render if there's no scroll or no button to show
  if (!hasScroll || !showButton) return null;

  return (
    <>
      {/* Scroll to top button - shown when scrolled down */}
      {showButton === "top" && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="h-6 w-6" />
        </button>
      )}

      {/* Scroll to bottom button - shown when at top */}
      {showButton === "bottom" && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to bottom"
        >
          <ChevronDownIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
}

