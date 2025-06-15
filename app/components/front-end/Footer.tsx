"use client";

import Link from "next/link";
import BrandName from "./shared/BrandName";
import { categories } from "@/app/lib/data/categories";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BoltIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

/**
 * Footer component that displays site information, navigation links, and copyright notice
 * Organized into four main sections: Brand, Quick Links, Categories, and Contact Info
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Split categories into two columns
  const midPoint = Math.ceil(categories.length / 2);
  const firstColumn = categories.slice(0, midPoint);
  const secondColumn = categories.slice(midPoint);

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section with logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
            <BrandName />
            </Link>
          </div>

          {/* Quick navigation links */}
          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <BoltIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Quick Links
              </h3>
            </div>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/#featured-articles"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Featured Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#highlight-articles"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Highlight Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#trending-articles"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Trending Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#related-articles"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Related Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Category navigation links */}
          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Categories
              </h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              {/* First column */}
              <div>
                <ul className="space-y-4">
                  {firstColumn.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/explore?categoryId=${category.id}`}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Second column */}
              <div>
                <ul className="space-y-4">
                  {secondColumn.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/explore?categoryId=${category.id}`}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Contact Us
              </h3>
            </div>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-500 flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span>thangtruong1808@gmail.com</span>
              </li>
              <li className="text-base text-gray-500 flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span>0466828649</span>
              </li>
              <li className="text-base text-gray-500 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span>Truganina, Melbourne, Australia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom section with copyright and legal links */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} DailyTechNews. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
