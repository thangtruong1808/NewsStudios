"use client";

import Link from "next/link";
import { NewspaperIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <NewspaperIcon className="h-8 w-8 text-indigo-500" />
                <span className="ml-2 text-xl font-bold text-indigo-600">
                  DailyTechNews
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-500 text-center md:text-left">
                Your trusted source for the latest technology news and insights.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/category/technology"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/category/science"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Science
                </Link>
              </li>
              <li>
                <Link
                  href="/category/innovation"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Innovation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-500">
                Email: info@dailytechnews.com
              </li>
              <li className="text-base text-gray-500">
                Phone: +1 (555) 123-4567
              </li>
              <li className="text-base text-gray-500">
                Address: 123 Tech Street, Digital City, TC 12345
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
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
        </div>
      </div>
    </footer>
  );
}
