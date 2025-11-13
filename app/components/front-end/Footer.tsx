import { use } from "react";
import Link from "next/link";
import BrandName from "./shared/BrandName";
import { getNavCategories } from "@/app/lib/actions/categories";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BoltIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

// Component Info
// Description: Server-rendered footer showcasing brand info, helpful links, and navigation categories.
// Data created: Category list fetched from the database for footer navigation.
// Author: thangtruong

const navCategoriesPromise = getNavCategories();

export default function Footer() {
  const { data } = use(navCategoriesPromise);
  const categories = (data ?? []).map((category) => ({ id: category.id, name: category.name }));
  const currentYear = new Date().getFullYear();

  const midPoint = Math.ceil(categories.length / 2);
  const firstColumn = categories.slice(0, midPoint);
  const secondColumn = categories.slice(midPoint);

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1536px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <BrandName />
            </Link>
          </div>

          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <BoltIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Quick Links
              </h3>
            </div>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/#featured-articles"
                  className="text-base text-gray-500 transition hover:text-blue-500 hover:font-bold"
                >
                  Featured Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#highlight-articles"
                  className="text-base text-gray-500 transition hover:text-blue-500 hover:font-bold"
                >
                  Highlight Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#trending-articles"
                  className="text-base text-gray-500 transition hover:text-blue-500 hover:font-bold"
                >
                  Trending Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#related-articles"
                  className="text-base text-gray-500 transition hover:text-blue-500 hover:font-bold"
                >
                  Related Articles
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Categories
              </h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <ul className="space-y-4">
                  {firstColumn.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/explore?categoryId=${category.id}`}
                        className="text-base text-gray-500 transition hover:text-blue-500 hover:font-bold"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  {secondColumn.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/explore?categoryId=${category.id}`}
                        className="text-base text-gray-500 transition hover:text-blue-500 hover:font-bold"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Contact Us
              </h3>
            </div>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center gap-2 text-base text-gray-500">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span>thangtruong1808@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-base text-gray-500">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span>0466828649</span>
              </li>
              <li className="flex items-center gap-2 text-base text-gray-500">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span>Truganina, Melbourne, Australia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <HeartIcon className="h-5 w-5 text-pink-500" />
            <p>Crafted with passion by thangtruong to showcase Next.js craftsmanship.</p>
            <HeartIcon className="h-5 w-5 text-pink-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
