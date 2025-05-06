"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/app/lib/definition";
import { getCategories } from "@/app/lib/actions/categories";
import {
  Bars3Icon,
  NewspaperIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "@/app/components/Button";

export default function NavBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      {/* First Row - Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 m-5">
        <div className="flex justify-center items-center h-20">
          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <NewspaperIcon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-indigo-500" />
            <Link href="/" className="text-xl font-bold text-indigo-600 mt-1">
              DailyTechNews
            </Link>
          </div>
        </div>
      </div>

      {/* Second Row - Categories and Login */}
      <div className="hidden sm:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/")
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              {!isLoading &&
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(`/category/${category.id}`)
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
            </div>
            {/* Login Button - Desktop */}
            <div className="flex items-center">
              <Button href="/login">Login</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center justify-end sm:hidden px-4 py-2">
        <button
          onClick={toggleMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/")
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Home
            </Link>
            {!isLoading &&
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(`/category/${category.id}`)
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            {/* Login Button - Mobile */}
            <div className="pl-3 pr-4 py-2">
              <Button href="/login">Login</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
