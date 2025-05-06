"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/app/lib/definition";
import { getCategories } from "@/app/lib/actions/categories";
import { getSubcategories } from "@/app/lib/actions/subcategories";
import {
  Bars3Icon,
  NewspaperIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "@/app/components/Button";

export default function NavBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<{ [key: number]: any[] }>(
    {}
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
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

  const handleCategoryClick = async (categoryId: number) => {
    if (activeDropdown === categoryId) {
      setActiveDropdown(null);
      return;
    }

    try {
      const result = await getSubcategories();
      if (result.data) {
        const categorySubcategories = result.data.filter(
          (sub) => sub.category_id === categoryId
        );
        setSubcategories((prev) => ({
          ...prev,
          [categoryId]: categorySubcategories,
        }));
        setActiveDropdown(categoryId);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white">
      {/* First Row - Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 m-5">
        <div className="flex justify-center items-center h-20">
          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <NewspaperIcon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-indigo-500" />
            <Link
              href="/"
              className="text-xl font-bold text-indigo-600 mt-1 italic"
            >
              <span className="relative inline-flex items-center">
                <span className="text-3xl">D</span>
                <span className="pl-1">aily</span>
                <span className="text-3xl">T</span>
                <span>ech</span>
                <span className="text-3xl">N</span>
                <span>ews</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Second Row - Categories and Login */}
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
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(`/category/${category.id}`)
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === category.id &&
                    subcategories[category.id] && (
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1" role="menu">
                          {subcategories[category.id].map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={`/explore?subcategoryId=${subcategory.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
          </div>

          <div className="flex items-center">
            <Button href="/login">Login</Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sm:hidden">
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
                <div key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive(`/category/${category.id}`)
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                  {activeDropdown === category.id &&
                    subcategories[category.id] && (
                      <div className="pl-6">
                        {subcategories[category.id].map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/explore?subcategoryId=${subcategory.id}`}
                            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
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
