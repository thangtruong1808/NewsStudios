"use client";

import { useState } from "react";
import {
  XMarkIcon,
  HandRaisedIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function PortfolioNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 ">
        <div className="py-2 flex items-center justify-between">
          <p className="text-sm text-red-500 flex-1 text-center flex items-center justify-center gap-2">
            <InformationCircleIcon className="h-5 w-5" />
            <span className="text-sm">
              This project serves as a personal portfolio and is not intended
              for commercial use.
            </span>
            <HandRaisedIcon className="h-5 w-5 animate-wave" />
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-red-500 hover:text-red-800 transition-colors duration-200 hover:border-2 hover:border-red-500 "
            aria-label="Close notice"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
