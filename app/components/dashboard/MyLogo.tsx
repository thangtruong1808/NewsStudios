import { NewspaperIcon } from "@heroicons/react/24/outline";
import { lusitana } from "../fonts";
import Link from "next/link";
import clsx from "clsx";

/**
 * MyLogo Component
 * Displays the application logo with a newspaper icon and brand name
 * Features hover effects and gradient styling
 */
export default function MyLogo() {
  return (
    <div className="">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand section with hover effects */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Icon container with gradient background and blur effect */}
            <div className="relative">
              {/* Gradient background with hover opacity transition */}
              <div className="absolute inset-0 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
              {/* Icon wrapper with white background */}
              <div className="relative p-2 rounded-lg ">
                <NewspaperIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            {/* Brand name with blue text color */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-500">
                YourNewsHub
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
