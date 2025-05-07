"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function PortfolioNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 flex items-center justify-between">
          <p className="text-sm text-orange-800 flex-1 text-center">
            This project is considered as a personal portfolio and not for
            commercial use
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-orange-600 hover:text-orange-800 transition-colors duration-200"
            aria-label="Close notice"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
