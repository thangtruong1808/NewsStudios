"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/app/lib/definition";
import { getCategories } from "@/app/lib/actions/categories";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import {
  Bars3Icon,
  NewspaperIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@/app/components/Button";

export default function NavBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Separate states for each section
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<
    number | null
  >(null);
  const [mobileSubcategories, setMobileSubcategories] = useState<{
    [key: number]: any[];
  }>({});

  const [desktopActiveDropdown, setDesktopActiveDropdown] = useState<
    number | null
  >(null);
  const [desktopSubcategories, setDesktopSubcategories] = useState<{
    [key: number]: any[];
  }>({});

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

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleMobileCategoryClick = async (categoryId: number) => {
    if (mobileActiveDropdown === categoryId) {
      setMobileActiveDropdown(null);
      return;
    }

    try {
      const result = await getSubcategories();
      if (result.data) {
        const categorySubcategories = result.data.filter(
          (sub) => sub.category_id === categoryId
        );
        setMobileSubcategories((prev) => ({
          ...prev,
          [categoryId]: categorySubcategories,
        }));
        setMobileActiveDropdown(categoryId);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleDesktopCategoryClick = async (categoryId: number) => {
    if (desktopActiveDropdown === categoryId) {
      setDesktopActiveDropdown(null);
      return;
    }

    try {
      const result = await getSubcategories();
      if (result.data) {
        const categorySubcategories = result.data.filter(
          (sub) => sub.category_id === categoryId
        );
        setDesktopSubcategories((prev) => ({
          ...prev,
          [categoryId]: categorySubcategories,
        }));
        setDesktopActiveDropdown(categoryId);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white">
      {/* Logo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            <NewspaperIcon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-stone-500" />
            <Link
              href="/"
              className="text-2xl font-bold text-stone-500 mt-1 italic"
            >
              <span className="relative inline-flex items-center">
                <span className="text-3xl">D</span>
                <span>aily</span>
                <span className="text-3xl">T</span>
                <span>ech</span>
                <span className="text-3xl">N</span>
                <span>ews</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around items-center py-3">
            {/* Mobile Menu Button with Categories */}
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 border border-gray-300"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-md font-medium">Menu</span>
                    <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
                  </span>
                )}
              </button>

              {/* Mobile Off-Canvas Drawer */}
              <div
                className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
                  mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                {/* Backdrop */}
                <div
                  className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
                    mobileMenuOpen ? "opacity-100" : "opacity-0"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer Content */}
                <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                  <div className="h-full flex flex-col">
                    {/* Drawer Header */}
                    <div className="px-4 py-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Menu
                      </h2>
                    </div>

                    {/* Drawer Body */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-2 py-4">
                        <Link
                          href="/"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md ${
                            isActive("/") ? "bg-gray-50" : ""
                          }`}
                        >
                          Home
                        </Link>
                        {!isLoading &&
                          categories.map((category) => (
                            <div key={category.id}>
                              <button
                                onClick={() =>
                                  handleMobileCategoryClick(category.id)
                                }
                                className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md ${
                                  isActive(`/category/${category.id}`)
                                    ? "bg-gray-50"
                                    : ""
                                }`}
                              >
                                {category.name}
                              </button>
                              {mobileActiveDropdown === category.id &&
                                mobileSubcategories[category.id] && (
                                  <div className="pl-4">
                                    {mobileSubcategories[category.id].map(
                                      (subcategory) => (
                                        <Link
                                          key={subcategory.id}
                                          href={`/explore?subcategoryId=${subcategory.id}`}
                                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                                        >
                                          {subcategory.name}
                                        </Link>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Drawer Footer */}
                    <div className="px-4 py-4 border-t border-gray-200">
                      <div className="w-full flex justify-center">
                        <Button href="/login">Login</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories - Desktop View */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/")
                    ? "border-stone-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              {!isLoading &&
                categories.map((category) => (
                  <div key={category.id} className="relative group">
                    <button
                      onClick={() => handleDesktopCategoryClick(category.id)}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium ${
                        isActive(`/category/${category.id}`)
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {category.name}
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {desktopActiveDropdown === category.id &&
                      desktopSubcategories[category.id] && (
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1" role="menu">
                            {desktopSubcategories[category.id].map(
                              (subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={`/explore?subcategoryId=${subcategory.id}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  {subcategory.name}
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4 ml-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1877F2] hover:text-[#0d6efd] transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A66C2] hover:text-[#004182] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Login Button - Desktop Only */}
            <div className="hidden md:flex items-center">
              <Button href="/login">Login</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
