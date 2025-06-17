"use client";

import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon,
  TagIcon,
  ChartBarIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import NavLink from "./NavLink";
import { useState } from "react";

interface NavLinksProps {
  isCollapsed?: boolean;
}

// Group links by category for better organization
const linkGroups = [
  {
    name: "Main",
    links: [
      { name: "Home", href: "/dashboard", icon: HomeIcon },
      { name: "Articles", href: "/dashboard/articles", icon: DocumentTextIcon },
      { name: "Videos", href: "/dashboard/videos", icon: ChartBarIcon },
      { name: "Photos", href: "/dashboard/photos", icon: PhotoIcon },
    ],
  },
  {
    name: "Users & Authors",
    links: [
      { name: "Users", href: "/dashboard/users", icon: UserGroupIcon },
      { name: "Authors", href: "/dashboard/author", icon: HomeIcon },
    ],
  },
  {
    name: "Content Management",
    links: [
      { name: "Categories", href: "/dashboard/categories", icon: HomeIcon },
      {
        name: "Subcategories",
        href: "/dashboard/subcategories",
        icon: HomeIcon,
      },
      { name: "Tags", href: "/dashboard/tags", icon: TagIcon },
    ],
  },

  // Planning do it later
  // {
  //   name: "Business",
  //   links: [
  //     { name: "Sponsors", href: "/dashboard/sponsor", icon: AcademicCapIcon },
  //     {
  //       name: "Advertisements",
  //       href: "/dashboard/advertisements",
  //       icon: BanknotesIcon,
  //     },
  //   ],
  // },
];

export default function NavLinks({ isCollapsed }: NavLinksProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(linkGroups.map((group) => [group.name, true]))
  );

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="space-y-6">
      {linkGroups.map((group) => (
        <div key={group.name}>
          {!isCollapsed && (
            <button
              onClick={() => toggleGroup(group.name)}
              className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-blue-400 uppercase tracking-wider hover:text-blue-600 transition-colors"
            >
              <span>{group.name}</span>
              <ChevronDownIcon
                className={clsx(
                  "w-4 h-4 transition-transform duration-200",
                  expandedGroups[group.name] ? "transform rotate-180" : ""
                )}
              />
            </button>
          )}
          <div
            className={clsx(
              "mt-2 space-y-1 overflow-hidden transition-all duration-200",
              isCollapsed ? "mt-1" : "",
              !expandedGroups[group.name] && !isCollapsed
                ? "max-h-0"
                : "max-h-[500px]"
            )}
          >
            {group.links.map((link) => {
              const LinkIcon = link.icon;
              const isActive =
                link.name === "Home"
                  ? pathname === link.href
                  : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

              return (
                <div
                  key={link.name}
                  className={clsx(
                    "rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-600/10 to-blue-400/10"
                      : "hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-blue-400/10"
                  )}
                >
                  <NavLink
                    href={link.href}
                    icon={LinkIcon}
                    label={link.name}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
