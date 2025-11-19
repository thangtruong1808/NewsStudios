"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon, KeyIcon, ArrowRightOnRectangleIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

// Component Info
// Description: User profile dropdown menu displaying avatar only in navbar button, with full user info in dropdown menu.
// Date created: 2025-01-27
// Author: thangtruong

export default function UserProfileDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut({ redirect: false, callbackUrl: "/" });
      if (pathname === "/") router.push("/");
      else if (pathname.startsWith("/dashboard")) router.replace("/login");
      else router.push("/");
    } catch (_error) {
      // Silent: session state managed by NextAuth
    }
  };

  if (!session?.user) {
    return null;
  }

  // Format role display name
  const roleDisplayName = session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1);
  
  // Check if user has valid image URL and store it
  const userImage = session.user.user_image && 
    typeof session.user.user_image === "string" && 
    session.user.user_image.trim() !== ""
    ? session.user.user_image
    : null;
  const hasValidImage = userImage !== null;
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const firstname = session.user.firstname || "";
    const lastname = session.user.lastname || "";
    if (firstname && lastname) {
      return `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
    }
    if (firstname) return firstname.charAt(0).toUpperCase();
    if (lastname) return lastname.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile trigger button - avatar only */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {/* Avatar with initials fallback */}
        {hasValidImage && userImage ? (
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200">
            <Image 
              src={userImage} 
              alt={`${session.user.firstname} ${session.user.lastname}`} 
              fill 
              className="object-cover"
              unoptimized={process.env.NODE_ENV === "development"}
            />
          </span>
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-300 ring-2 ring-slate-200">
            <span className="text-xs font-medium text-white">{getUserInitials()}</span>
          </span>
        )}
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
          {/* User info header */}
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Avatar with initials fallback */}
              {hasValidImage && userImage ? (
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200">
                  <Image 
                    src={userImage} 
                    alt={`${session.user.firstname} ${session.user.lastname}`} 
                    fill 
                    className="object-cover"
                    unoptimized={process.env.NODE_ENV === "development"}
                  />
                </span>
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-300 ring-2 ring-slate-200">
                  <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{session.user.firstname} {session.user.lastname}</p>
                <p className="truncate text-xs text-slate-500">{session.user.email}</p>
                <p className="mt-1 truncate text-xs font-medium text-blue-600">{roleDisplayName}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <Squares2X2Icon className="h-5 w-5 text-slate-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/login/reset-password"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <KeyIcon className="h-5 w-5 text-slate-400" />
              <span>Update Password</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

