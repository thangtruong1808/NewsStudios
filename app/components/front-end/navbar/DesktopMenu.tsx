"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuProps } from "./types";
import { subcategories } from "@/app/lib/data/categories";
import { UserIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Logo from "../shared/Logo";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DesktopMenu({
  categories,
  isLoading,
  isActive,
}: MenuProps) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter((sub) => sub.category_id === categoryId);
  };

  const handleSignOut = async () => {
    try {
      // Close the dropdown first
      setIsDropdownOpen(false);

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

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full">
      {/* Home Section */}
      <div className="flex items-center justify-center w-1/4 lg:w-1/5 xl:w-1/4">
        <Link
          href="/"
          className={`text-sm font-medium ${isActive("/") ? "text-black" : "text-gray-500 hover:text-gray-900"
            }`}
        >
          <Logo />
        </Link>
      </div>

      {/* Categories Section */}
      <div className="flex items-center justify-center space-x-4 md:space-x-6 lg:space-x-8 w-2/4 lg:w-3/5 xl:w-2/4">
        {!isLoading &&
          categories.map((category) => (
            <div key={category.id} className="relative group">
              <div className="flex items-center">
                <Link
                  href={`/explore?categoryId=${category.id}`}
                  className={`hover:text-lg text-sm xl:text-lg hover:text-green-500 font-medium px-1 ${isActive(`/category/${category.id}`)
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {category.name}
                </Link>
              </div>

              {/* Dropdown Menu */}
              <div
                className="absolute left-0 w-40 md:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 hidden group-hover:block mt-2 hover:text-green-500"
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
                        className="block px-2 md:px-2 py-2 text-xs md:text-sm text-gray-700 hover:text-green-500 rounded-md"
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

      {/* Login/User Section */}
      <div className="flex items-center justify-center w-1/4 lg:w-1/5 xl:w-1/4">
        {session?.user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`text-sm md:text-md font-medium ${isActive("/profile") ? "text-black" : "text-gray-500"
                }`}
            >
              <span className="flex flex-col items-center border-2 border-gray-500 px-2 py-1 rounded-md hover:text-green-500 hover:border-green-500">
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
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </div>
              </span>
            </button>

            {/* User Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-auto min-w-[120px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 hover:text-green-500 w-full"
                    role="menuitem"
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
            className={`text-sm md:text-md font-medium ${isActive("/login") ? "text-black" : "text-gray-500"
              }`}
          >
            <span className="flex flex-col xl:flex-row items-center border-2 border-gray-500 px-2 py-1 rounded-md hover:text-green-500 hover:border-green-500">
              <UserIcon className="h-5 w-5" />
              <span className="mt-1 xl:mt-0 xl:ml-1 text-sm">Login</span>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
