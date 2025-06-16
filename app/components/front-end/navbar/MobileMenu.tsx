"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";
import { MenuProps } from "./types";
import { subcategories } from "@/app/lib/data/categories";
import Logo from "../shared/Logo";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function MobileMenu({
  categories,
  isLoading,
  isActive,
}: MenuProps) {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<number | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Handle click outside to close mobile menu and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle mobile menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
        setMobileActiveDropdown(null);
        setIsUserDropdownOpen(false);
      }

      // Handle user dropdown specifically
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
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

  const handleSignOut = async () => {
    try {
      // Close all menus and dropdowns first
      setMobileMenuOpen(false);
      setMobileActiveDropdown(null);
      setIsUserDropdownOpen(false);

      // Clear any existing session data
      await signOut({
        redirect: false,
        callbackUrl: '/'
      });

      // Handle redirection based on current page
      if (pathname === '/') {
        // If on home page, stay on home page
        router.push('/');
      } else if (pathname.startsWith('/dashboard')) {
        // If on dashboard, redirect to login with clean URL
        router.replace('/login');
      } else {
        // For any other page, redirect to home
        router.push('/');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter((sub) => sub.category_id === categoryId);
  };

  return (
    <div className="relative lg:hidden" ref={mobileMenuRef}>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 border border-gray-300 hover:text-blue-500 hover:border-blue-500"
      >
        <span className="sr-only">Open main menu</span>

        <span className="flex items-center gap-2 hover:text-blue-500 hover:font-bold">
          <span className="text-md font-medium">Menu</span>
          <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
        </span>
      </button>

      {/* Mobile Off-Canvas Drawer */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => {
            setMobileMenuOpen(false);
            setMobileActiveDropdown(null);
            setIsUserDropdownOpen(false);
          }}
        />

        {/* Drawer Content */}
        <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
          <div className="h-full flex flex-col">
            {/* Drawer Header */}
            <div className="px-4 py-6 border-b border-gray-200 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileActiveDropdown(null);
                  setIsUserDropdownOpen(false);
                }}
                className="p-1 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 border border-2 border-gray-300 hover:text-blue-500 hover:border-blue-500"
              >
                <span className="sr-only ">Close menu</span>
                <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-blue-500 hover:border-blue-500" aria-hidden="true" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-2 py-4">
                <Link
                  href="/"
                  className={`block px-4 py-2 text-md text-gray-700 hover:text-blue-500 hover:font-bold hover:bg-gray-100 rounded-md ${isActive("/") ? "bg-gray-50" : ""
                    }`}
                >
                  Home
                </Link>
                {!isLoading &&
                  categories.map((category) => {
                    const hasSubcategories = getSubcategoriesForCategory(category.id).length > 0;
                    return (
                      <div key={category.id}>
                        <button
                          onClick={() => handleMobileCategoryClick(category.id)}
                          className={`w-full text-left px-4 py-2 text-md text-gray-700 hover:text-blue-500 hover:font-bold hover:bg-gray-100 rounded-md flex items-center justify-between ${isActive(`/category/${category.id}`)
                            ? "bg-gray-50"
                            : ""
                            }`}
                        >
                          <span>{category.name}</span>
                          {hasSubcategories && (
                            <ChevronDownIcon
                              className={`h-5 w-5 transition-transform duration-200 ${mobileActiveDropdown === category.id ? "transform rotate-180" : ""
                                }`}
                            />
                          )}
                        </button>
                        {mobileActiveDropdown === category.id && (
                          <div className="pl-4">
                            {getSubcategoriesForCategory(category.id).map(
                              (subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={`/explore?subcategoryId=${subcategory.id}`}
                                  className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-500 hover:font-bold hover:bg-gray-100 rounded-md"
                                >
                                  {subcategory.name}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-200 p-4">
              {session?.user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="w-full flex flex-col items-center border-2 border-gray-500 px-2 py-1 rounded-md hover:text-blue-500 hover:border-blue-500"
                  >
                    {session.user.user_image ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={session.user.user_image}
                          alt={`${session.user.firstname} ${session.user.lastname}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-center">
                        {session.user.firstname} {session.user.lastname}
                      </span>
                      <ChevronDownIcon
                        className={`h-4 w-4 ml-1 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 hover:text-blue-500 w-full"
                        >
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-gray-500 rounded-md hover:text-blue-500 hover:border-blue-500"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
