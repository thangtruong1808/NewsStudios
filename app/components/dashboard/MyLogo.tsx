import { NewspaperIcon } from "@heroicons/react/24/outline";
import { lusitana } from "../fonts";
import Link from "next/link";
import clsx from "clsx";

export default function MyLogo() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white p-2 rounded-lg shadow-sm">
                <NewspaperIcon className="h-6 w-6 text-violet-600" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                DailyTechNews
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
