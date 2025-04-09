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
    <Link
      href={href}
      className={clsx(
        "flex h-12 w-full items-center justify-center rounded-lg p-2 text-sm font-medium md:h-10 md:w-full md:flex-none md:justify-start md:p-2 md:px-3",
        {
          "bg-indigo-600 text-white": isActive,
          "text-gray-600 hover:bg-gray-100": !isActive,
        }
      )}
    >
      <Icon className="h-8 w-8 md:h-5 md:w-5" />
      <span className="hidden md:ml-3 md:block">{label}</span>
    </Link>
  );
}
