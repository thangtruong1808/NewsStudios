"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ComponentType } from "react";

interface NavLinkProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}

export default function NavLink({ href, icon: Icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div className="group relative w-full px-2">
      <Link
        href={href}
        className={clsx(
          "flex h-12 w-full items-center justify-center text-sm font-medium md:h-10 md:w-full md:flex-none md:justify-start",
          {
            "bg-indigo-600 text-white rounded-md": isActive,
            "text-gray-600 hover:bg-zinc-200 rounded-md": !isActive,
          }
        )}
      >
        <div className="flex items-center justify-center md:justify-start w-full px-3">
          <Icon className="h-7 w-7 md:h-6 md:w-6" />
          <span className="hidden md:ml-3 md:block text-sm"> {label}</span>
        </div>
      </Link>
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:hidden">
        {label}
      </div>
    </div>
  );
}
