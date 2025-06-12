"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MenuProps } from "./types";
import { subcategories } from "@/app/lib/data/categories";

export default function MobileMenu({
  categories,
  isLoading,
  isActive,
}: MenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<
    number | null
  >(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  const handleMobileCategoryClick = (categoryId: number) => {
    if (mobileActiveDropdown === categoryId) {
      setMobileActiveDropdown(null);
      return;
    }
    setMobileActiveDropdown(categoryId);
  };

  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter((sub) => sub.category_id === categoryId);
  };

  return (
    <div className="relative lg:hidden" ref={mobileMenuRef}>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
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
                        onClick={() => handleMobileCategoryClick(category.id)}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md ${
                          isActive(`/category/${category.id}`)
                            ? "bg-gray-50"
                            : ""
                        }`}
                      >
                        {category.name}
                      </button>
                      {mobileActiveDropdown === category.id && (
                        <div className="pl-4">
                          {getSubcategoriesForCategory(category.id).map(
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
          </div>
        </div>
      </div>
    </div>
  );
}
