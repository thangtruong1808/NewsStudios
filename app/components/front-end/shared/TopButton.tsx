"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function TopButton() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [hasScroll, setHasScroll] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Check if page has scroll
  const checkHasScroll = () => {
    const body = document.body;
    const html = document.documentElement;
    
    // Get the maximum height between body and html
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    
    // Check if the height is greater than the viewport height
    const hasVerticalScroll = height > window.innerHeight;
    setHasScroll(hasVerticalScroll);
  };

  // Check scroll position
  const checkScrollPosition = () => {
    setIsAtTop(window.pageYOffset < 100);
  };

  // Set up event listeners and observer
  useEffect(() => {
    // Initial check
    checkHasScroll();

    // Set up MutationObserver to watch for content changes
    observerRef.current = new MutationObserver(() => {
      checkHasScroll();
    });

    // Start observing the document body for changes
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Add event listeners
    window.addEventListener("load", checkHasScroll);
    window.addEventListener("resize", checkHasScroll);
    if (hasScroll) {
      window.addEventListener("scroll", checkScrollPosition);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener("load", checkHasScroll);
      window.removeEventListener("resize", checkHasScroll);
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, [hasScroll]);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Scroll to bottom smoothly
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  // Don't render if there's no scroll
  if (!hasScroll) return null;

  return (
    <>
      <button
        onClick={isAtTop ? scrollToBottom : scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out z-50 flex flex-col items-center"
        aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
      >
        {isAtTop ? (
          <>
            <ChevronDownIcon className="h-6 w-6" />
            <span className="text-xs mt-1">BOTTOM</span>
          </>
        ) : (
          <>
            <ChevronUpIcon className="h-6 w-6" />
            <span className="text-xs mt-1">TOP</span>
          </>
        )}
      </button>
    </>
  );
}
