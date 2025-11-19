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
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

// Component Info
// Description: Server-rendered footer showcasing brand info, helpful links, and navigation categories with modern styling.
// Date created: 2025-01-27
// Author: thangtruong

const navCategoriesPromise = getNavCategories();

export default function Footer() {
  const { data } = use(navCategoriesPromise);
  const categories = (data ?? []).map((category) => ({ id: category.id, name: category.name }));

  const midPoint = Math.ceil(categories.length / 2);
  const firstColumn = categories.slice(0, midPoint);
  const secondColumn = categories.slice(midPoint);

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-[1536px] px-4 py-16 sm:px-6 lg:px-10 xl:px-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <BrandName />
            </Link>
            {/* Social media icons */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/thang-truong-00b245200/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="LinkedIn"
              >
                {/* @ts-expect-error - react-icons TypeScript compatibility issue */}
                <FaLinkedin className="h-6 w-6 text-[#0077B5]" />
              </a>
              <a
                href="https://github.com/thangtruong1808"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="GitHub"
              >
                {/* @ts-expect-error - react-icons TypeScript compatibility issue */}
                <FaGithub className="h-6 w-6 text-[#181717]" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100051753410222"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="Facebook"
              >
                {/* @ts-expect-error - react-icons TypeScript compatibility issue */}
                <FaFacebook className="h-6 w-6 text-[#1877F2]" />
              </a>
            </div>
          </div>

          {/* Quick Links section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <BoltIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Quick Links
              </h3>
            </div>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/#featured-articles"
                  className="text-base text-slate-600 transition-all hover:text-blue-600 hover:font-semibold hover:translate-x-1 inline-block"
                >
                  Featured Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#highlight-articles"
                  className="text-base text-slate-600 transition-all hover:text-blue-600 hover:font-semibold hover:translate-x-1 inline-block"
                >
                  Highlight Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#trending-articles"
                  className="text-base text-slate-600 transition-all hover:text-blue-600 hover:font-semibold hover:translate-x-1 inline-block"
                >
                  Trending Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#related-articles"
                  className="text-base text-slate-600 transition-all hover:text-blue-600 hover:font-semibold hover:translate-x-1 inline-block"
                >
                  Related Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <FolderIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Categories
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              <div>
                <ul className="space-y-3.5">
                  {firstColumn.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/explore?categoryId=${category.id}`}
                        className="text-base text-slate-600 transition-all hover:text-blue-600 hover:font-semibold hover:translate-x-1 inline-block"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-3.5">
                  {secondColumn.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/explore?categoryId=${category.id}`}
                        className="text-base text-slate-600 transition-all hover:text-blue-600 hover:font-semibold hover:translate-x-1 inline-block"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Contact Us
              </h3>
            </div>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-base text-slate-600">
                <EnvelopeIcon className="h-5 w-5 text-slate-400 shrink-0" />
                <a href="mailto:thangtruong1808@gmail.com" className="transition-colors hover:text-blue-600">
                  thangtruong1808@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-base text-slate-600">
                <PhoneIcon className="h-5 w-5 text-slate-400 shrink-0" />
                <a href="tel:0466828649" className="transition-colors hover:text-blue-600">
                  0466828649
                </a>
              </li>
              <li className="flex items-start gap-3 text-base text-slate-600">
                <MapPinIcon className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <span>Truganina, Melbourne, Australia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500 sm:flex-row">
            <HeartIcon className="h-5 w-5 text-pink-500 animate-pulse" />
            <p className="text-center">
              Crafted with passion by thangtruong • © {new Date().getFullYear()} NewsStudios
            </p>
            <HeartIcon className="h-5 w-5 text-pink-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
