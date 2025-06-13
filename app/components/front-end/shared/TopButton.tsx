"use client";

import { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function TopButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(true);
    }
    // Check if we're at the top of the page
    setIsAtTop(window.pageYOffset < 100);
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    // Initial check
    toggleVisibility();
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

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
