"use client";

import Link from "next/link";
import { MenuProps } from "./types";
import { subcategories } from "@/app/lib/data/categories";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";

export default function DesktopMenu({
  categories,
  isLoading,
  isActive,
}: MenuProps) {
  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter((sub) => sub.category_id === categoryId);
  };

  return (
    <div className="flex w-full">
      {/* Home Section */}
      <div className="flex items-center justify-center w-1/4 ">
        <Link
          href="/"
          className={`text-sm font-medium  ${
            isActive("/") ? "text-black" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <HomeIcon className="h-8 w-8" />
        </Link>
      </div>

      {/* Categories Section */}
      <div className="flex items-center justify-center space-x-8 w-2/4">
        {!isLoading &&
          categories.map((category) => (
            <div key={category.id} className="relative group">
              <div className="flex items-center">
                <Link
                  href={`/category/${category.id}`}
                  className={`text-md font-medium px-2 ${
                    isActive(`/category/${category.id}`)
                      ? "text-black"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {category.name}
                </Link>
              </div>

              {/* Dropdown Menu */}
              <div
                className="absolute left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 hidden group-hover:block mt-2"
                style={{ top: "100%", marginTop: "0" }}
              >
                <div
                  className="py-2"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {getSubcategoriesForCategory(category.id).map(
                    (subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/explore?subcategoryId=${subcategory.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                        role="menuitem"
                      >
                        {subcategory.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Login Section */}
      <div className="flex items-center justify-center w-1/4 ">
        <Link
          href="/login"
          className={`text-md font-medium  ${
            isActive("/login")
              ? "text-black"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span className="flex items-center">
            <UserIcon className="h-6 w-8" />
            Login
          </span>
        </Link>
      </div>
    </div>
  );
}
