"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon, UserIcon, KeyIcon, ArrowRightOnRectangleIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

// Component Info
// Description: User profile dropdown menu displaying avatar, name, role, and account actions.
// Date created: 2024
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        {session.user.user_image ? (
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200">
            <Image src={session.user.user_image} alt={`${session.user.firstname} ${session.user.lastname}`} fill className="object-cover" />
          </span>
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-2 ring-slate-200">
            <UserIcon className="h-4 w-4 text-slate-500" />
          </span>
        )}
        {/* Name and role */}
        <span className="hidden text-left sm:block">
          <span className="block truncate text-xs font-semibold leading-tight">{session.user.firstname} {session.user.lastname}</span>
          <span className="block truncate text-xs text-slate-500">{roleDisplayName}</span>
        </span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
          {/* User info header */}
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              {session.user.user_image ? (
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-200">
                  <Image src={session.user.user_image} alt={`${session.user.firstname} ${session.user.lastname}`} fill className="object-cover" />
                </span>
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-2 ring-slate-200">
                  <UserIcon className="h-6 w-6 text-slate-500" />
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

